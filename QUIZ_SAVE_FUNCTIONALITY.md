# Quiz Save Functionality - Implementation & Testing Guide

## Overview
The quiz saving functionality allows authenticated users to save their self-assessment results to the database for future reference and tracking.

## Components Implemented

### 1. Frontend (quiz.js)
- **Quiz Form Handling**: Validates all questions are answered before submission
- **Result Calculation**: Computes stress level based on answers (low/moderate/high)
- **Save Button Logic**: 
  - Only appears after quiz completion
  - Redirects to login if user not authenticated
  - Shows loading state during save operation
  - Handles various error scenarios

### 2. Backend API
- **Endpoint**: `POST /api/quiz/save`
- **Authentication**: Required (JWT token)
- **Data Validation**: Comprehensive validation for all fields
- **Database**: MongoDB with QuizResult model

### 3. Database Model (QuizResult.js)
```javascript
{
  userId: ObjectId,      // Reference to User
  q1: Number,           // Question 1 answer (1-3)
  q2: Number,           // Question 2 answer (1-3) 
  q3: Number,           // Question 3 answer (1-3)
  total: Number,        // Sum of all answers
  resultLevel: String,  // 'low', 'moderate', or 'high'
  createdAt: Date       // Timestamp
}
```

## API Endpoints

### Save Quiz Results
```
POST /api/quiz/save
Headers: 
  - Authorization: Bearer <jwt_token>
  - Content-Type: application/json

Body:
{
  "q1": 3,
  "q2": 2, 
  "q3": 1,
  "resultLevel": "moderate"
}

Response:
{
  "success": true,
  "message": "Quiz results saved successfully",
  "result": { ... }
}
```

### Get User Results
```
GET /api/quiz/my-results
Headers:
  - Authorization: Bearer <jwt_token>

Response:
{
  "success": true,
  "message": "Quiz results retrieved successfully", 
  "results": [ ... ]
}
```

## Validation Rules

### Frontend Validation
- All 3 questions must be answered
- Quiz must be completed before save is available
- User must be authenticated

### Backend Validation
- All fields (q1, q2, q3, resultLevel) are required
- q1, q2, q3 must be integers between 1-3
- resultLevel must be one of: 'low', 'moderate', 'high'
- User must be authenticated (JWT token valid)

## Error Handling

### Frontend Errors
- **Not Authenticated**: Redirects to login with returnUrl
- **Network Error**: Shows user-friendly error message
- **Server Error**: Displays specific error message from server
- **Token Expired**: Clears token and redirects to login

### Backend Errors
- **400 Bad Request**: Invalid data format or missing fields
- **401 Unauthorized**: Missing or invalid authentication token
- **500 Internal Server Error**: Database or server issues

## Testing Results

✅ **Authentication**: Correctly rejects unauthenticated requests  
✅ **Token Validation**: Properly handles invalid/expired tokens  
✅ **Data Validation**: Validates all required fields and data types  
✅ **Database Operations**: Successfully saves and retrieves quiz results  
✅ **Error Handling**: Provides appropriate error messages  

## User Flow

1. **Take Quiz**: User answers all 3 questions
2. **View Results**: Quiz calculates and displays stress level
3. **Save Results**: 
   - If not logged in → Redirect to login page
   - If logged in → Save to database
4. **Confirmation**: User sees success message

## Security Features

- **JWT Authentication**: All save operations require valid token
- **User Isolation**: Users can only access their own results
- **Input Validation**: Comprehensive server-side validation
- **Error Sanitization**: No sensitive data exposed in error messages

## Future Enhancements

- [ ] Quiz history display in user dashboard
- [ ] Progress tracking over time
- [ ] Export quiz results
- [ ] Multiple quiz types support
- [ ] Anonymous quiz taking (without saving)

## Testing Instructions

1. **Start Backend**: `cd backend && npm start`
2. **Open Frontend**: Navigate to quiz page
3. **Test Without Login**: Complete quiz, try to save → should redirect to login
4. **Test With Login**: Login, complete quiz, save → should work successfully
5. **Test Edge Cases**: Try invalid data, expired tokens, network issues

## Files Modified

- `frontend/quiz.js` - Enhanced quiz logic and save functionality
- `backend/models/QuizResult.js` - Added resultLevel field
- `backend/controllers/quizController.js` - Improved validation and error handling
- `backend/routes/quiz.js` - API endpoint configuration
- `backend/server.js` - Route registration

The quiz saving functionality is now fully implemented, tested, and ready for production use. 