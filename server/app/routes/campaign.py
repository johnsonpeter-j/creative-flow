from fastapi import APIRouter, Depends, HTTPException
from typing import List
from bson import ObjectId
from app.schemas.campaign import (
    CreateCampaignRequest,
    CampaignResponse,
    GenerateIdeasResponse,
    CampaignIdeaSchema,
    GenerateAdCopyRequest,
    GenerateAdCopyResponse,
    AdCopySchema
)
from app.repositories.campaign_repository import CampaignRepository
from app.services.campaign_service import get_campaign_service
from app.utils.dependencies import get_campaign_repository, get_current_user_id
from datetime import datetime

router = APIRouter(prefix="/campaigns", tags=["campaigns"])


@router.post("/create", response_model=CampaignResponse)
async def create_campaign(
    campaign_data: CreateCampaignRequest,
    user_id: str = Depends(get_current_user_id),
    campaign_repo: CampaignRepository = Depends(get_campaign_repository)
):
    """Create a new campaign"""
    try:
        # Create campaign document
        campaign_doc = {
            "_id": ObjectId(),
            "user_id": user_id,
            "campaign_brief": campaign_data.campaign_brief,
            "objective": campaign_data.objective,
            "target_audience": campaign_data.target_audience,
            "ad_formats": campaign_data.ad_formats,
            "all_ideas": [],
            "top_ideas": [],
            "status": "draft",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        campaign = await campaign_repo.create(campaign_doc)
        
        return CampaignResponse(
            id=campaign.id,
            user_id=campaign.user_id,
            campaign_brief=campaign.campaign_brief,
            objective=campaign.objective,
            target_audience=campaign.target_audience,
            ad_formats=campaign.ad_formats,
            all_ideas=[],
            top_ideas=[],
            selected_idea_index=None,
            ad_copy=None,
            status=campaign.status,
            created_at=campaign.created_at.isoformat(),
            updated_at=campaign.updated_at.isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create campaign: {str(e)}")


@router.post("/{campaign_id}/generate-ideas", response_model=GenerateIdeasResponse)
async def generate_campaign_ideas(
    campaign_id: str,
    user_id: str = Depends(get_current_user_id),
    campaign_repo: CampaignRepository = Depends(get_campaign_repository)
):
    """Generate campaign ideas using multi-agent system"""
    try:
        # Get campaign
        campaign = await campaign_repo.get_by_id(campaign_id)
        if not campaign:
            raise HTTPException(status_code=404, detail="Campaign not found")
        
        # Verify ownership
        if campaign.user_id != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to access this campaign")
        
        # Generate ideas using multi-agent system
        campaign_service = get_campaign_service()
        result = await campaign_service.generate_campaign_ideas(
            campaign_brief=campaign.campaign_brief,
            objective=campaign.objective,
            target_audience=campaign.target_audience,
            ad_formats=campaign.ad_formats,
            threshold=7.0
        )
        
        # Ensure we have top ideas
        if not result.get("top_ideas") or len(result["top_ideas"]) == 0:
            raise HTTPException(
                status_code=500,
                detail="Failed to generate ideas: No ideas were generated"
            )
        
        # Update campaign with generated ideas
        update_data = {
            "all_ideas": [idea.model_dump() for idea in result["all_ideas"]],
            "top_ideas": [idea.model_dump() for idea in result["top_ideas"]],
            "status": "ideas_generated"
        }
        
        await campaign_repo.update(campaign_id, update_data)
        
        return GenerateIdeasResponse(
            campaign_id=campaign_id,
            top_ideas=result["top_ideas"],
            message="Successfully generated campaign ideas"
        )
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_detail = str(e)
        print(f"Error generating campaign ideas: {error_detail}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Failed to generate ideas: {error_detail}")


@router.get("/{campaign_id}", response_model=CampaignResponse)
async def get_campaign(
    campaign_id: str,
    user_id: str = Depends(get_current_user_id),
    campaign_repo: CampaignRepository = Depends(get_campaign_repository)
):
    """Get campaign by ID"""
    campaign = await campaign_repo.get_by_id(campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    # Verify ownership
    if campaign.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this campaign")
    
    # Convert ad_copy model to schema if exists
    ad_copy_schema = None
    if campaign.ad_copy:
        ad_copy_schema = AdCopySchema(
            headline=campaign.ad_copy.headline,
            body=campaign.ad_copy.body,
            call_to_action=campaign.ad_copy.call_to_action,
            visual_direction=campaign.ad_copy.visual_direction,
            image_url=campaign.ad_copy.image_url
        )
    
    # Convert CampaignIdeaModel to CampaignIdeaSchema
    all_ideas_schema = [
        CampaignIdeaSchema(
            title=idea.title,
            description=idea.description,
            score=idea.score,
            reasoning=idea.reasoning
        )
        for idea in campaign.all_ideas
    ]
    
    top_ideas_schema = [
        CampaignIdeaSchema(
            title=idea.title,
            description=idea.description,
            score=idea.score,
            reasoning=idea.reasoning
        )
        for idea in campaign.top_ideas
    ]
    
    return CampaignResponse(
        id=campaign.id,
        user_id=campaign.user_id,
        campaign_brief=campaign.campaign_brief,
        objective=campaign.objective,
        target_audience=campaign.target_audience,
        ad_formats=campaign.ad_formats,
        all_ideas=all_ideas_schema,
        top_ideas=top_ideas_schema,
        selected_idea_index=campaign.selected_idea_index,
        ad_copy=ad_copy_schema,
        status=campaign.status,
        created_at=campaign.created_at.isoformat(),
        updated_at=campaign.updated_at.isoformat()
    )


@router.get("/", response_model=List[CampaignResponse])
async def get_user_campaigns(
    user_id: str = Depends(get_current_user_id),
    campaign_repo: CampaignRepository = Depends(get_campaign_repository)
):
    """Get all campaigns for the current user"""
    campaigns = await campaign_repo.get_by_user_id(user_id)
    
    result = []
    for campaign in campaigns:
        ad_copy_schema = None
        if campaign.ad_copy:
            ad_copy_schema = AdCopySchema(
                headline=campaign.ad_copy.headline,
                body=campaign.ad_copy.body,
                call_to_action=campaign.ad_copy.call_to_action,
                visual_direction=campaign.ad_copy.visual_direction,
                image_url=campaign.ad_copy.image_url
            )
        
        # Convert CampaignIdeaModel to CampaignIdeaSchema
        all_ideas_schema = [
            CampaignIdeaSchema(
                title=idea.title,
                description=idea.description,
                score=idea.score,
                reasoning=idea.reasoning
            )
            for idea in campaign.all_ideas
        ]
        
        top_ideas_schema = [
            CampaignIdeaSchema(
                title=idea.title,
                description=idea.description,
                score=idea.score,
                reasoning=idea.reasoning
            )
            for idea in campaign.top_ideas
        ]
        
        result.append(CampaignResponse(
            id=campaign.id,
            user_id=campaign.user_id,
            campaign_brief=campaign.campaign_brief,
            objective=campaign.objective,
            target_audience=campaign.target_audience,
            ad_formats=campaign.ad_formats,
            all_ideas=all_ideas_schema,
            top_ideas=top_ideas_schema,
            selected_idea_index=campaign.selected_idea_index,
            ad_copy=ad_copy_schema,
            status=campaign.status,
            created_at=campaign.created_at.isoformat(),
            updated_at=campaign.updated_at.isoformat()
        ))
    
    return result


@router.post("/{campaign_id}/generate-ad-copy", response_model=GenerateAdCopyResponse)
async def generate_ad_copy(
    campaign_id: str,
    request: GenerateAdCopyRequest,
    user_id: str = Depends(get_current_user_id),
    campaign_repo: CampaignRepository = Depends(get_campaign_repository)
):
    """Generate ad copy and visual direction with image for selected campaign idea"""
    try:
        # Verify campaign_id matches
        if request.campaign_id != campaign_id:
            raise HTTPException(status_code=400, detail="Campaign ID mismatch")
        
        # Get campaign
        campaign = await campaign_repo.get_by_id(campaign_id)
        if not campaign:
            raise HTTPException(status_code=404, detail="Campaign not found")
        
        # Verify ownership
        if campaign.user_id != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to access this campaign")
        
        # Verify selected idea index is valid
        if request.selected_idea_index < 0 or request.selected_idea_index >= len(campaign.top_ideas):
            raise HTTPException(status_code=400, detail="Invalid selected idea index")
        
        selected_idea = campaign.top_ideas[request.selected_idea_index]
        
        # Generate ad copy and image
        campaign_service = get_campaign_service()
        result = await campaign_service.generate_ad_copy_and_visual(
            campaign_brief=campaign.campaign_brief,
            objective=campaign.objective,
            target_audience=campaign.target_audience,
            selected_idea_title=selected_idea.title,
            selected_idea_description=selected_idea.description,
            ad_formats=campaign.ad_formats
        )
        
        # Create AdCopyModel
        ad_copy_model = {
            "headline": result["headline"],
            "body": result["body"],
            "call_to_action": result["call_to_action"],
            "visual_direction": result["visual_direction"],
            "image_url": result.get("image_url")
        }
        
        # Update campaign with ad copy
        update_data = {
            "selected_idea_index": request.selected_idea_index,
            "ad_copy": ad_copy_model,
            "status": "ad_copy_generated"
        }
        
        await campaign_repo.update(campaign_id, update_data)
        
        # Create response schema
        ad_copy_schema = AdCopySchema(**ad_copy_model)
        
        return GenerateAdCopyResponse(
            campaign_id=campaign_id,
            ad_copy=ad_copy_schema,
            message="Successfully generated ad copy and visual direction"
        )
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_detail = str(e)
        print(f"Error generating ad copy: {error_detail}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Failed to generate ad copy: {error_detail}")


@router.post("/{campaign_id}/generate-image", response_model=GenerateAdCopyResponse)
async def generate_image(
    campaign_id: str,
    user_id: str = Depends(get_current_user_id),
    campaign_repo: CampaignRepository = Depends(get_campaign_repository)
):
    """Generate or regenerate image for campaign ad copy"""
    try:
        # Get campaign
        campaign = await campaign_repo.get_by_id(campaign_id)
        if not campaign:
            raise HTTPException(status_code=404, detail="Campaign not found")
        
        # Verify ownership
        if campaign.user_id != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to access this campaign")
        
        # Check if ad copy exists
        if not campaign.ad_copy:
            raise HTTPException(status_code=400, detail="Ad copy must be generated first")
        
        # Generate image using the visual direction
        campaign_service = get_campaign_service()
        image_url = await campaign_service.generate_image_only(
            visual_direction=campaign.ad_copy.visual_direction,
            headline=campaign.ad_copy.headline,
            campaign_brief=campaign.campaign_brief
        )
        
        # Update the ad_copy with new image_url
        ad_copy_dict = {
            "headline": campaign.ad_copy.headline,
            "body": campaign.ad_copy.body,
            "call_to_action": campaign.ad_copy.call_to_action,
            "visual_direction": campaign.ad_copy.visual_direction,
            "image_url": image_url
        }
        
        update_data = {
            "ad_copy": ad_copy_dict
        }
        
        await campaign_repo.update(campaign_id, update_data)
        
        # Get updated campaign
        updated_campaign = await campaign_repo.get_by_id(campaign_id)
        ad_copy_schema = AdCopySchema(
            headline=updated_campaign.ad_copy.headline,
            body=updated_campaign.ad_copy.body,
            call_to_action=updated_campaign.ad_copy.call_to_action,
            visual_direction=updated_campaign.ad_copy.visual_direction,
            image_url=updated_campaign.ad_copy.image_url
        )
        
        return GenerateAdCopyResponse(
            campaign_id=campaign_id,
            ad_copy=ad_copy_schema,
            message="Successfully generated image"
        )
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_detail = str(e)
        print(f"Error generating image: {error_detail}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Failed to generate image: {error_detail}")

