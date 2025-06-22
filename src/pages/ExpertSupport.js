import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem as MenuItemComponent,
  Paper,
  Collapse
} from '@mui/material';
import {
  Send,
  Person,
  QuestionAnswer,
  Agriculture,
  Science,
  Pets,
  ThumbUp,
  Visibility,
  MoreVert,
  Edit,
  Delete,
  Reply,
  ExpandMore,
  ExpandLess,
  Comment as CommentIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const ExpertSupport = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    description: '',
    category: '',
    crop: '',
    urgency: 'medium'
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [commentText, setCommentText] = useState('');
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [expandedComments, setExpandedComments] = useState({});

  useEffect(() => {
    fetchQuestions();
  }, []);

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const fetchQuestions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/expert-support/questions');
      
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Failed to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuestion = async () => {
    if (!newQuestion.title || !newQuestion.description || !newQuestion.category || !newQuestion.crop) {
      setError('Please fill in all required fields');
      return;
    }

    setError('');
    try {
      const token = getAuthToken();
      if (!token) {
        setError('Please login to ask questions');
        return;
      }

      const url = editingQuestion 
        ? `http://localhost:5000/api/expert-support/questions/${editingQuestion._id}`
        : 'http://localhost:5000/api/expert-support/questions';
      
      const method = editingQuestion ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newQuestion)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${editingQuestion ? 'update' : 'submit'} question`);
      }

      await fetchQuestions();
      setDialogOpen(false);
      setEditingQuestion(null);
      setNewQuestion({
        title: '',
        description: '',
        category: '',
        crop: '',
        urgency: 'medium'
      });
      setError('');
    } catch (error) {
      console.error('Error with question:', error);
      setError(`Failed to ${editingQuestion ? 'update' : 'submit'} question. Please try again.`);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answerText.trim() || !selectedQuestion) return;

    setError('');
    try {
      const token = getAuthToken();
      if (!token) {
        setError('Please login to answer questions');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/expert-support/questions/${selectedQuestion._id}/answer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ answer: answerText })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit answer');
      }

      const result = await response.json();
      setSelectedQuestion(result.question);
      setAnswerText('');
      await fetchQuestions();
      setError('');
    } catch (error) {
      console.error('Error submitting answer:', error);
      setError(error.message || 'Failed to submit answer. Please try again.');
    }
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !selectedQuestion) return;

    setError('');
    try {
      const token = getAuthToken();
      if (!token) {
        setError('Please login to comment');
        return;
      }

      const url = editingComment 
        ? `http://localhost:5000/api/expert-support/questions/${selectedQuestion._id}/comments/${editingComment._id}`
        : `http://localhost:5000/api/expert-support/questions/${selectedQuestion._id}/comments`;
      
      const method = editingComment ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: commentText })
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editingComment ? 'update' : 'add'} comment`);
      }

      // Refresh the selected question
      const questionResponse = await fetch(`http://localhost:5000/api/expert-support/questions/${selectedQuestion._id}`);
      const updatedQuestion = await questionResponse.json();
      setSelectedQuestion(updatedQuestion);
      
      setCommentText('');
      setEditingComment(null);
      await fetchQuestions();
    } catch (error) {
      console.error('Error with comment:', error);
      setError(`Failed to ${editingComment ? 'update' : 'add'} comment. Please try again.`);
    }
  };

  const handleLike = async (questionId, commentId = null) => {
    setError('');
    try {
      const token = getAuthToken();
      if (!token) {
        setError('Please login to like');
        return;
      }

      const url = commentId 
        ? `http://localhost:5000/api/expert-support/questions/${questionId}/comments/${commentId}/like`
        : `http://localhost:5000/api/expert-support/questions/${questionId}/like`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to like');
      }

      await fetchQuestions();
      
      // Update selected question if it's open
      if (selectedQuestion && selectedQuestion._id === questionId) {
        const questionResponse = await fetch(`http://localhost:5000/api/expert-support/questions/${questionId}`);
        const updatedQuestion = await questionResponse.json();
        setSelectedQuestion(updatedQuestion);
      }
    } catch (error) {
      console.error('Error liking:', error);
      setError('Failed to like. Please try again.');
    }
  };

  const handleDelete = async (questionId, commentId = null) => {
    if (!window.confirm(`Are you sure you want to delete this ${commentId ? 'comment' : 'question'}?`)) {
      return;
    }

    setError('');
    try {
      const token = getAuthToken();
      if (!token) {
        setError('Please login to delete');
        return;
      }

      const url = commentId 
        ? `http://localhost:5000/api/expert-support/questions/${questionId}/comments/${commentId}`
        : `http://localhost:5000/api/expert-support/questions/${questionId}`;

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete ${commentId ? 'comment' : 'question'}`);
      }

      if (commentId) {
        // Refresh the selected question
        const questionResponse = await fetch(`http://localhost:5000/api/expert-support/questions/${questionId}`);
        const updatedQuestion = await questionResponse.json();
        setSelectedQuestion(updatedQuestion);
      } else {
        // Close dialog if question was deleted
        setSelectedQuestion(null);
      }

      await fetchQuestions();
      setMenuAnchor(null);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error deleting:', error);
      setError(`Failed to delete ${commentId ? 'comment' : 'question'}. Please try again.`);
    }
  };

  const handleEdit = (item, isComment = false) => {
    if (isComment) {
      setEditingComment(item);
      setCommentText(item.text);
    } else {
      setEditingQuestion(item);
      setNewQuestion({
        title: item.title,
        description: item.description,
        category: item.category,
        crop: item.crop,
        urgency: item.urgency
      });
      setDialogOpen(true);
    }
    setMenuAnchor(null);
        setMenuAnchor(null);
    setSelectedItem(null);
  };

  const handleMenuOpen = (event, item, isComment = false) => {
    setMenuAnchor(event.currentTarget);
    setSelectedItem({ ...item, isComment });
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedItem(null);
  };

  const toggleComments = (questionId) => {
    setExpandedComments(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'disease':
        return <Science color="error" />;
      case 'pest_control':
        return <Pets color="warning" />;
      case 'cultivation':
        return <Agriculture color="success" />;
      case 'soil':
        return <Agriculture color="info" />;
      case 'irrigation':
        return <Agriculture color="primary" />;
      case 'fertilization':
        return <Agriculture color="secondary" />;
      default:
        return <QuestionAnswer />;
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'answered':
        return 'success';
      case 'pending':
        return 'warning';
      case 'in_progress':
        return 'info';
      default:
        return 'default';
    }
  };

  const isUserAuthor = (authorId) => {
    return user && user.id === authorId;
  };

  const isUserLiked = (likes) => {
    return user && likes && likes.some(like => like.user === user.id);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading expert support...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Expert Support
        </Typography>
        <Button
          variant="contained"
          startIcon={<QuestionAnswer />}
          onClick={() => setDialogOpen(true)}
        >
          Ask Question
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Questions List */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Recent Questions & Answers
              </Typography>
              {questions.length === 0 ? (
                <Typography variant="body2" color="textSecondary" sx={{ py: 4, textAlign: 'center' }}>
                  No questions yet. Be the first to ask an expert!
                </Typography>
              ) : (
                <List>
                  {questions.map((question, index) => (
                    <React.Fragment key={question._id}>
                      <ListItem alignItems="flex-start" sx={{ cursor: 'pointer' }}>
                        <ListItemAvatar>
                          <Avatar>
                            {getCategoryIcon(question.category)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          onClick={() => setSelectedQuestion(question)}
                          primary={
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                              <Typography variant="h6">{question.title}</Typography>
                              <Chip
                                label={question.status}
                                color={getStatusColor(question.status)}
                                size="small"
                              />
                              <Chip
                                label={question.urgency}
                                color={getUrgencyColor(question.urgency)}
                                size="small"
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="textSecondary" paragraph>
                                {question.description.length > 150 
                                  ? `${question.description.substring(0, 150)}...`
                                  : question.description
                                }
                              </Typography>
                              <Box display="flex" alignItems="center" gap={2} mb={1}>
                                <Chip
                                  label={question.crop}
                                  color="primary"
                                  variant="outlined"
                                  size="small"
                                />
                                <Box display="flex" alignItems="center" gap={1}>
                                  <Visibility fontSize="small" />
                                  <Typography variant="caption">{question.views || 0}</Typography>
                                </Box>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <ThumbUp 
                                    fontSize="small" 
                                    color={isUserLiked(question.likes) ? 'primary' : 'inherit'}
                                  />
                                  <Typography variant="caption">{question.likes?.length || 0}</Typography>
                                </Box>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <CommentIcon fontSize="small" />
                                  <Typography variant="caption">{question.comments?.length || 0}</Typography>
                                </Box>
                              </Box>
                              <Typography variant="caption" color="textSecondary">
                                Asked by {question.askedBy?.name || 'Anonymous'} on {new Date(question.createdAt).toLocaleDateString()}
                              </Typography>
                              {question.expert && (
                                <Typography variant="caption" color="success.main" display="block">
                                  Answered by {question.expert.name}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                        <Box display="flex" alignItems="center" gap={1}>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(question._id);
                            }}
                            size="small"
                            color={isUserLiked(question.likes) ? 'primary' : 'default'}
                          >
                            <ThumbUp fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleComments(question._id);
                            }}
                            size="small"
                          >
                            {expandedComments[question._id] ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                          {(isUserAuthor(question.askedBy?._id) || user?.role === 'admin') && (
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMenuOpen(e, question);
                              }}
                              size="small"
                            >
                              <MoreVert fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      </ListItem>
                      
                      {/* Comments Section */}
                      <Collapse in={expandedComments[question._id]} timeout="auto" unmountOnExit>
                        <Box sx={{ ml: 8, mr: 2, mb: 2 }}>
                          {question.comments && question.comments.length > 0 && (
                            <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                Comments ({question.comments.length})
                              </Typography>
                              {question.comments.map((comment) => (
                                <Box key={comment._id} sx={{ mb: 2, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                    <Box flex={1}>
                                      <Typography variant="body2" paragraph>
                                        {comment.text}
                                      </Typography>
                                      <Box display="flex" alignItems="center" gap={2}>
                                        <Typography variant="caption" color="textSecondary">
                                          {comment.author?.name || 'Anonymous'}
                                          {comment.isExpertResponse && (
                                            <Chip label="Expert" size="small" color="success" sx={{ ml: 1 }} />
                                          )}
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                          {new Date(comment.createdAt).toLocaleDateString()}
                                        </Typography>
                                        <Box display="flex" alignItems="center" gap={1}>
                                          <IconButton
                                            size="small"
                                            onClick={() => handleLike(question._id, comment._id)}
                                            color={isUserLiked(comment.likes) ? 'primary' : 'default'}
                                          >
                                            <ThumbUp fontSize="small" />
                                          </IconButton>
                                          <Typography variant="caption">{comment.likes?.length || 0}</Typography>
                                        </Box>
                                      </Box>
                                    </Box>
                                    {(isUserAuthor(comment.author?._id) || user?.role === 'admin') && (
                                      <IconButton
                                        size="small"
                                        onClick={(e) => handleMenuOpen(e, comment, true)}
                                      >
                                        <MoreVert fontSize="small" />
                                      </IconButton>
                                    )}
                                  </Box>
                                </Box>
                              ))}
                            </Paper>
                          )}
                          
                          {/* Add Comment */}
                          {user && (
                            <Box display="flex" gap={1} alignItems="flex-end">
                              <TextField
                                size="small"
                                fullWidth
                                placeholder="Add a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                multiline
                                maxRows={3}
                              />
                              <Button
                                size="small"
                                variant="contained"
                                onClick={handleSubmitComment}
                                disabled={!commentText.trim()}
                                startIcon={<Send />}
                              >
                                {editingComment ? 'Update' : 'Comment'}
                              </Button>
                              {editingComment && (
                                <Button
                                  size="small"
                                  onClick={() => {
                                    setEditingComment(null);
                                    setCommentText('');
                                  }}
                                >
                                  Cancel
                                </Button>
                              )}
                            </Box>
                          )}
                        </Box>
                      </Collapse>
                      
                      {index < questions.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Expert Information */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Available Experts
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar><Person /></Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Dr. Sarah Johnson"
                    secondary="Plant Pathologist"
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar><Person /></Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Dr. Michael Green"
                    secondary="Organic Farming Specialist"
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar><Person /></Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Dr. Priya Sharma"
                    secondary="Soil Science Expert"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Support Guidelines
              </Typography>
              <Typography variant="body2" paragraph>
                • Be specific about your problem
              </Typography>
              <Typography variant="body2" paragraph>
                • Include crop type and location
              </Typography>
              <Typography variant="body2" paragraph>
                • Attach photos if possible
              </Typography>
              <Typography variant="body2" paragraph>
                • Response time: 24-48 hours
              </Typography>
              <Typography variant="body2" paragraph>
                • Everyone can comment and help
              </Typography>
              <Typography variant="body2" paragraph>
                • Like helpful responses
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItemComponent
          onClick={() => handleEdit(selectedItem, selectedItem?.isComment)}
        >
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItemComponent>
        <MenuItemComponent
          onClick={() => handleDelete(
            selectedItem?.isComment ? selectedQuestion._id : selectedItem?._id,
            selectedItem?.isComment ? selectedItem._id : null
          )}
        >
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItemComponent>
      </Menu>

      {/* Ask/Edit Question Dialog */}
      <Dialog open={dialogOpen} onClose={() => {
        setDialogOpen(false);
        setEditingQuestion(null);
        setNewQuestion({
          title: '',
          description: '',
          category: '',
          crop: '',
          urgency: 'medium'
        });
      }} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingQuestion ? 'Edit Question' : 'Ask an Expert'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Question Title"
                value={newQuestion.title}
                onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Detailed Description"
                multiline
                rows={4}
                value={newQuestion.description}
                onChange={(e) => setNewQuestion({ ...newQuestion, description: e.target.value })}
                                placeholder="Please provide as much detail as possible about your problem..."
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={newQuestion.category}
                  label="Category"
                  onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
                >
                  <MenuItem value="disease">Plant Disease</MenuItem>
                  <MenuItem value="pest_control">Pest Control</MenuItem>
                  <MenuItem value="cultivation">Cultivation</MenuItem>
                  <MenuItem value="soil">Soil Management</MenuItem>
                  <MenuItem value="irrigation">Irrigation</MenuItem>
                  <MenuItem value="fertilization">Fertilization</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Crop Type"
                value={newQuestion.crop}
                onChange={(e) => setNewQuestion({ ...newQuestion, crop: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Urgency</InputLabel>
                <Select
                  value={newQuestion.urgency}
                  label="Urgency"
                  onChange={(e) => setNewQuestion({ ...newQuestion, urgency: e.target.value })}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setDialogOpen(false);
            setEditingQuestion(null);
            setNewQuestion({
              title: '',
              description: '',
              category: '',
              crop: '',
              urgency: 'medium'
            });
          }}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitQuestion} 
            variant="contained" 
            startIcon={<Send />}
            disabled={!newQuestion.title || !newQuestion.description || !newQuestion.category || !newQuestion.crop}
          >
            {editingQuestion ? 'Update Question' : 'Submit Question'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Question Detail Dialog */}
      <Dialog 
        open={!!selectedQuestion}
        onClose={() => setSelectedQuestion(null)}
        maxWidth="md"
        fullWidth
        maxHeight="90vh"
      >
        {selectedQuestion && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">{selectedQuestion.title}</Typography>
                {(isUserAuthor(selectedQuestion.askedBy?._id) || user?.role === 'admin') && (
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, selectedQuestion)}
                    size="small"
                  >
                    <MoreVert />
                  </IconButton>
                )}
              </Box>
            </DialogTitle>
            <DialogContent sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={selectedQuestion.status}
                  color={getStatusColor(selectedQuestion.status)}
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={selectedQuestion.crop}
                  color="primary"
                  variant="outlined"
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={selectedQuestion.urgency}
                  color={getUrgencyColor(selectedQuestion.urgency)}
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={selectedQuestion.category}
                  color="secondary"
                  variant="outlined"
                />
              </Box>
              
              <Typography variant="h6" gutterBottom>Question:</Typography>
              <Typography variant="body1" paragraph>
                {selectedQuestion.description}
              </Typography>
              
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Visibility fontSize="small" />
                  <Typography variant="body2">{selectedQuestion.views || 0} views</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <ThumbUp 
                    fontSize="small" 
                    color={isUserLiked(selectedQuestion.likes) ? 'primary' : 'inherit'}
                  />
                  <Typography variant="body2">{selectedQuestion.likes?.length || 0} likes</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <CommentIcon fontSize="small" />
                  <Typography variant="body2">{selectedQuestion.comments?.length || 0} comments</Typography>
                </Box>
              </Box>
              
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Asked by {selectedQuestion.askedBy?.name || 'Anonymous'} on {new Date(selectedQuestion.createdAt).toLocaleDateString()}
              </Typography>

              {/* Expert Answer Section */}
              {selectedQuestion.answer && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom color="success.main">
                    Expert Answer:
                  </Typography>
                  <Paper elevation={1} sx={{ p: 2, bgcolor: 'success.50', mb: 2 }}>
                    <Typography variant="body1" paragraph>
                      {selectedQuestion.answer}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Answered by {selectedQuestion.expert?.name || 'Expert'} on {new Date(selectedQuestion.answerDate).toLocaleDateString()}
                    </Typography>
                  </Paper>
                </>
              )}

              {/* Comments Section */}
              {selectedQuestion.comments && selectedQuestion.comments.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Comments & Responses ({selectedQuestion.comments.length})
                  </Typography>
                  {selectedQuestion.comments.map((comment) => (
                    <Paper key={comment._id} elevation={1} sx={{ p: 2, mb: 2, bgcolor: comment.isExpertResponse ? 'info.50' : 'grey.50' }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box flex={1}>
                          <Typography variant="body1" paragraph>
                            {comment.text}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={2} mb={1}>
                            <Typography variant="caption" color="textSecondary">
                              {comment.author?.name || 'Anonymous'}
                              {comment.isExpertResponse && (
                                <Chip label="Expert" size="small" color="info" sx={{ ml: 1 }} />
                              )}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <IconButton
                              size="small"
                              onClick={() => handleLike(selectedQuestion._id, comment._id)}
                              color={isUserLiked(comment.likes) ? 'primary' : 'default'}
                            >
                              <ThumbUp fontSize="small" />
                            </IconButton>
                            <Typography variant="caption">{comment.likes?.length || 0} likes</Typography>
                          </Box>
                        </Box>
                        {(isUserAuthor(comment.author?._id) || user?.role === 'admin') && (
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, comment, true)}
                          >
                            <MoreVert fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Paper>
                  ))}
                </>
              )}

              {/* Add Comment Section */}
              {user && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    {editingComment ? 'Edit Comment' : 'Add Your Response'}
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your thoughts, experience, or additional questions..."
                    sx={{ mb: 2 }}
                  />
                  <Box display="flex" gap={1}>
                    <Button
                      variant="contained"
                      onClick={handleSubmitComment}
                      startIcon={<Send />}
                      disabled={!commentText.trim()}
                    >
                      {editingComment ? 'Update Comment' : 'Post Comment'}
                    </Button>
                    {editingComment && (
                      <Button
                        onClick={() => {
                          setEditingComment(null);
                          setCommentText('');
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </Box>
                </>
              )}

              {/* Expert Answer Form */}
              {user?.role === 'expert' && selectedQuestion.status !== 'answered' && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom color="success.main">
                    Provide Expert Answer:
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    placeholder="Provide your expert answer here..."
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleSubmitAnswer}
                    startIcon={<Send />}
                    disabled={!answerText.trim()}
                  >
                    Submit Expert Answer
                  </Button>
                </>
              )}

              {/* Message for non-experts when no answer */}
              {user?.role !== 'expert' && selectedQuestion.status !== 'answered' && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                    This question is waiting for an expert response. You can still add comments and share your experience above!
                  </Typography>
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedQuestion(null)}>Close</Button>
              {user && (
                <Button
                  onClick={() => handleLike(selectedQuestion._id)}
                  startIcon={<ThumbUp />}
                  color={isUserLiked(selectedQuestion.likes) ? 'primary' : 'inherit'}
                >
                  {isUserLiked(selectedQuestion.likes) ? 'Liked' : 'Like'} ({selectedQuestion.likes?.length || 0})
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default ExpertSupport;