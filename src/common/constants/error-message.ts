export const ERROR_MESSAGES = {
    ARTICLE_NOT_FOUND: 'The requested article was not found.',
    USER_NOT_FOUND: 'The specified user does not exist.',
    UNAUTHORIZED_UPDATE: 'You do not have permission to update this article.',
    UNAUTHORIZED_DELETE: 'You do not have permission to delete this article.',
    MISSING_AUTH_HEADER: 'Authorization header is missing. Please provide a valid access token.',
    INVALID_BEARER_TOKEN: 'Invalid Bearer token format. Expected format: Bearer <token>.',
    REFRESH_TOKEN_NOT_FOUND: 'Refresh token is missing. Please log in again.',
    INVALID_REFRESH_TOKEN: 'Invalid or expired refresh token. Please reauthenticate.',
    INCORRECT_CREDENTIALS: 'Incorrect username or password. Please check your credentials.',
};