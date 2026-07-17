# Simply Homemade Team Development Guide

## Database naming

Use snake_case for all database columns:

- user_id
- recipe_id
- profile_image
- cooking_time
- created_at
- updated_at

## Session format

Use:

```javascript
req.session.user = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    profile_image: user.profile_image
};