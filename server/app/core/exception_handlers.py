from fastapi import Request, status
from fastapi.responses import JSONResponse
from app.core.exceptions import AppException
import logging

logger = logging.getLogger(__name__)


async def app_exception_handler(request: Request, exc: AppException):
    """Handle application exceptions"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "message": exc.message,
            "status_code": exc.status_code
        }
    )


async def validation_exception_handler(request: Request, exc):
    """Handle validation exceptions"""
    errors = []
    if hasattr(exc, "errors"):
        for error in exc.errors():
            errors.append({
                "field": ".".join(str(loc) for loc in error["loc"]),
                "message": error["msg"]
            })
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "message": "Validation error",
            "errors": errors,
            "status_code": 422
        }
    )


async def general_exception_handler(request: Request, exc: Exception):
    """Handle general exceptions"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "message": "Internal server error",
            "status_code": 500
        }
    )

