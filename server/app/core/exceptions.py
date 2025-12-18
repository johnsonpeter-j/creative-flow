class AppException(Exception):
    """Base exception for application"""
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class NotFoundError(AppException):
    """Resource not found"""
    def __init__(self, message: str = "Resource not found"):
        super().__init__(message, status_code=404)


class ValidationError(AppException):
    """Validation error"""
    def __init__(self, message: str = "Validation error"):
        super().__init__(message, status_code=422)


class UnauthorizedError(AppException):
    """Unauthorized access"""
    def __init__(self, message: str = "Unauthorized"):
        super().__init__(message, status_code=401)


class ForbiddenError(AppException):
    """Forbidden access"""
    def __init__(self, message: str = "Forbidden"):
        super().__init__(message, status_code=403)


class ConflictError(AppException):
    """Resource conflict"""
    def __init__(self, message: str = "Resource already exists"):
        super().__init__(message, status_code=409)

