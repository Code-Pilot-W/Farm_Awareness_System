import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  TextField,
  InputAdornment,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  IconButton,
  Collapse,
  Alert,
  CircularProgress,
  Paper,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Search,
  Announcement,
  AccountBalance,
  TrendingUp,
  Science,
  Add,
  Comment,
  ExpandMore,
  ExpandLess,
  Send,
  Person,
  ThumbUp,
  Share,
  Bookmark,
  MoreVert,
  Edit,
  Delete,
  PhotoCamera
} from '@mui/icons-material';

const News = () => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [categories] = useState(['All', 'Government', 'Market', 'Technology', 'Weather']);
  const [openPostDialog, setOpenPostDialog] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});
  const [expandedContent, setExpandedContent] = useState({});
  const [editingNews, setEditingNews] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedNewsId, setSelectedNewsId] = useState(null);
  const [newPost, setNewPost] = useState({
    title: '',
    summary: '',
    content: '',
    category: 'Government',
    author: '',
    image: null,
    location: '',
    tags: ''
  });
  const [newComment, setNewComment] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    filterNews();
  }, [searchTerm, selectedCategory, news]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/news');
      if (response.ok) {
        const data = await response.json();
        setNews(data);
        setFilteredNews(data);
      } else {
        throw new Error('Failed to fetch news');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Failed to load news. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handlePostNews = async () => {
    try {
      setLoading(true);
      setError('');
      
      const formData = new FormData();
      formData.append('title', newPost.title);
      formData.append('summary', newPost.summary);
      formData.append('content', newPost.content);
      formData.append('category', newPost.category);
      formData.append('author', newPost.author);
      formData.append('location', newPost.location);
      formData.append('tags', newPost.tags);
      
      if (newPost.image) {
        formData.append('image', newPost.image);
      }

      const url = editingNews 
        ? `http://localhost:5000/api/news/${editingNews._id}`
        : 'http://localhost:5000/api/news';
      
      const method = editingNews ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        body: formData,
      });

      if (response.ok) {
        const savedPost = await response.json();
        
        if (editingNews) {
          setNews(news.map(item => item._id === editingNews._id ? savedPost : item));
          setSuccess('News updated successfully!');
        } else {
          setNews([savedPost, ...news]);
          setSuccess('News posted successfully!');
        }
        
        resetNewPost();
        setOpenPostDialog(false);
        setEditingNews(null);
      } else {
        throw new Error('Failed to save post');
      }
    } catch (error) {
      setError('Failed to save post. Please try again.');
      console.error('Error saving post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNews = async (newsId) => {
    if (!window.confirm('Are you sure you want to delete this news?')) return;
    
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/news/${newsId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setNews(news.filter(item => item._id !== newsId));
        setSuccess('News deleted successfully!');
      } else {
        throw new Error('Failed to delete news');
      }
    } catch (error) {
      setError('Failed to delete news. Please try again.');
      console.error('Error deleting news:', error);
    } finally {
      setLoading(false);
      handleMenuClose();
    }
  };

  const handleEditNews = (newsItem) => {
    setEditingNews(newsItem);
    setNewPost({
      title: newsItem.title,
      summary: newsItem.summary,
      content: newsItem.content,
      category: newsItem.category,
      author: newsItem.author,
      image: null, // Reset image for editing
      location: newsItem.location || '',
      tags: newsItem.tags ? newsItem.tags.join(', ') : ''
    });
    setOpenPostDialog(true);
    handleMenuClose();
  };

  const resetNewPost = () => {
    setNewPost({
      title: '',
      summary: '',
      content: '',
      category: 'Government',
      author: '',
      image: null,
      location: '',
      tags: ''
    });
  };

  const handleMenuClick = (event, newsId) => {
    setAnchorEl(event.currentTarget);
    setSelectedNewsId(newsId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNewsId(null);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      setNewPost({ ...newPost, image: file });
    }
  };

  const handleAddComment = async (newsId) => {
    if (!newComment[newsId]?.content || !newComment[newsId]?.author) return;
    try {
      const response = await fetch(`http://localhost:5000/api/news/${newsId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newComment[newsId]),
      });
      if (response.ok) {
        const updatedNews = await response.json();
        setNews(news.map(item => item._id === newsId ? updatedNews : item));
        setNewComment({
          ...newComment,
          [newsId]: { author: '', content: '' }
        });
        setSuccess('Comment added successfully!');
      } else {
        throw new Error('Failed to add comment');
      }
    } catch (error) {
      setError('Failed to add comment. Please try again.');
      console.error('Error adding comment:', error);
    }
  };

  const handleLikeNews = async (newsId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/news/${newsId}/like`, {
        method: 'PUT',
      });
      if (response.ok) {
        const updatedNews = await response.json();
        setNews(news.map(item => item._id === newsId ? updatedNews : item));
      } else {
        throw new Error('Failed to like news');
      }
    } catch (error) {
      console.error('Error liking news:', error);
      const updatedNews = news.map(item => {
        if (item._id === newsId) {
          return { ...item, likes: (item.likes || 0) + 1 };
        }
        return item;
      });
      setNews(updatedNews);
    }
  };

  const handleLikeComment = async (newsId, commentId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/news/${newsId}/comments/${commentId}/like`, {
        method: 'PUT',
      });
      if (response.ok) {
        const updatedNews = await response.json();
        setNews(news.map(item => item._id === newsId ? updatedNews : item));
      } else {
        throw new Error('Failed to like comment');
      }
    } catch (error) {
      console.error('Error liking comment:', error);
      const updatedNews = news.map(item => {
        if (item._id === newsId) {
          const updatedComments = item.comments.map(comment => {
            if (comment._id === commentId) {
              return { ...comment, likes: (comment.likes || 0) + 1 };
            }
            return comment;
          });
          return { ...item, comments: updatedComments };
        }
        return item;
      });
      setNews(updatedNews);
    }
  };

  const filterNews = () => {
    let filtered = news;
    
    if (selectedCategory > 0) {
      const category = categories[selectedCategory];
      filtered = filtered.filter(item => item.category === category);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }
    
    setFilteredNews(filtered);
  };

  const toggleComments = (newsId) => {
    setExpandedComments({
      ...expandedComments,
      [newsId]: !expandedComments[newsId]
    });
  };

  const toggleContent = (newsId) => {
    setExpandedContent({
      ...expandedContent,
      [newsId]: !expandedContent[newsId]
    });
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Government':
        return <AccountBalance color="primary" />;
      case 'Market':
        return <TrendingUp color="success" />;
      case 'Technology':
        return <Science color="info" />;
      case 'Weather':
        return <Announcement color="warning" />;
      default:
        return <Announcement />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Government':
        return 'primary';
      case 'Market':
        return 'success';
      case 'Technology':
        return 'info';
      case 'Weather':
        return 'warning';
      default:
        return 'default';
    }
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Nigerian Agricultural News & Updates
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenPostDialog(true)}
        >
          Post News
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Search and Filter */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search Nigerian agricultural news..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
        <Tabs
          value={selectedCategory}
          onChange={(e, newValue) => setSelectedCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {categories.map((category, index) => (
            <Tab key={index} label={category} />
          ))}
        </Tabs>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      <Grid container spacing={3}>
        {/* Main News */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {filteredNews.map((article) => (
              <Grid item xs={12} key={article._id}>
                <Card elevation={2}>
                  <Grid container>
                    <Grid item xs={12} sm={4}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={article.image ? `http://localhost:5000${article.image}` : '/images/default-news.jpg'}
                        alt={article.title}
                        onError={(e) => {
                          e.target.src = '/images/default-news.jpg';
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <CardContent>
                        <Box display="flex" alignItems="center" mb={1}>
                          {getCategoryIcon(article.category)}
                          <Chip
                            label={article.category}
                            color={getCategoryColor(article.category)}
                            size="small"
                            sx={{ ml: 1 }}
                          />
                          <Typography variant="caption" color="textSecondary" sx={{ ml: 'auto', mr: 1 }}>
                            {new Date(article.date).toLocaleDateString()}
                          </Typography>
                          <IconButton
                            size="small"
                                                        onClick={(e) => handleMenuClick(e, article._id)}
                          >
                            <MoreVert />
                          </IconButton>
                        </Box>
                        <Typography variant="h6" gutterBottom>
                          {article.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" paragraph>
                          {article.summary}
                        </Typography>
                        {/* Full Content with Read More/Less */}
                        <Box mb={2}>
                          <Typography variant="body2" paragraph>
                            {expandedContent[article._id]
                               ? article.content
                               : truncateText(article.content)
                            }
                          </Typography>
                          {article.content.length > 150 && (
                            <Button
                              size="small"
                              onClick={() => toggleContent(article._id)}
                              sx={{ p: 0, minWidth: 'auto' }}
                            >
                              {expandedContent[article._id] ? 'Read Less' : 'Read More'}
                            </Button>
                          )}
                        </Box>
                        {article.location && (
                          <Typography variant="caption" color="textSecondary" display="block" mb={1}>
                            📍 {article.location}
                          </Typography>
                        )}
                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                          <Typography variant="caption" color="textSecondary">
                            By: {article.author}
                          </Typography>
                          <Box>
                            {article.tags && article.tags.map((tag, index) => (
                              <Chip
                                key={index}
                                label={tag}
                                size="small"
                                variant="outlined"
                                sx={{ ml: 0.5 }}
                              />
                            ))}
                          </Box>
                        </Box>
                        {/* Action Buttons */}
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                          <Button
                            size="small"
                            startIcon={<ThumbUp />}
                            onClick={() => handleLikeNews(article._id)}
                            color="primary"
                          >
                            Like ({article.likes || 0})
                          </Button>
                          <Button
                            size="small"
                            startIcon={<Share />}
                            color="primary"
                          >
                            Share
                          </Button>
                          <Button
                            size="small"
                            startIcon={<Bookmark />}
                            color="primary"
                          >
                            Save
                          </Button>
                        </Box>
                        {/* Comments Section */}
                        <Box>
                          <Button
                            startIcon={<Comment />}
                            endIcon={expandedComments[article._id] ? <ExpandLess /> : <ExpandMore />}
                            onClick={() => toggleComments(article._id)}
                            size="small"
                            fullWidth
                            sx={{ justifyContent: 'flex-start' }}
                          >
                            Comments ({article.comments?.length || 0})
                          </Button>
                          <Collapse in={expandedComments[article._id]}>
                            <Paper variant="outlined" sx={{ mt: 2, p: 2 }}>
                              {/* Add Comment Form */}
                              <Box display="flex" gap={1} mb={2}>
                                <Avatar sx={{ width: 32, height: 32 }}>
                                  <Person />
                                </Avatar>
                                <Box flex={1}>
                                  <TextField
                                    size="small"
                                    placeholder="Your name"
                                    fullWidth
                                    value={newComment[article._id]?.author || ''}
                                    onChange={(e) => setNewComment({
                                      ...newComment,
                                      [article._id]: {
                                        ...newComment[article._id],
                                        author: e.target.value
                                      }
                                    })}
                                    sx={{ mb: 1 }}
                                  />
                                  <Box display="flex" gap={1}>
                                    <TextField
                                      size="small"
                                      placeholder="Add a comment..."
                                      fullWidth
                                      multiline
                                      rows={2}
                                      value={newComment[article._id]?.content || ''}
                                      onChange={(e) => setNewComment({
                                        ...newComment,
                                        [article._id]: {
                                          ...newComment[article._id],
                                          content: e.target.value
                                        }
                                      })}
                                    />
                                    <IconButton
                                      color="primary"
                                      onClick={() => handleAddComment(article._id)}
                                      disabled={!newComment[article._id]?.content || !newComment[article._id]?.author}
                                      sx={{ alignSelf: 'flex-end' }}
                                    >
                                      <Send />
                                    </IconButton>
                                  </Box>
                                </Box>
                              </Box>
                              <Divider sx={{ my: 2 }} />
                              {/* Existing Comments */}
                              {article.comments?.length > 0 ? (
                                article.comments.map((comment) => (
                                  <Box key={comment._id} sx={{ mb: 2 }}>
                                    <Box display="flex" gap={1}>
                                      <Avatar sx={{ width: 32, height: 32 }}>
                                        <Person />
                                      </Avatar>
                                      <Box flex={1}>
                                        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                            {comment.author}
                                          </Typography>
                                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                                            {comment.content}
                                          </Typography>
                                          <Box display="flex" alignItems="center" justifyContent="space-between" mt={1}>
                                            <Typography variant="caption" color="textSecondary">
                                              {new Date(comment.date).toLocaleDateString()} at {new Date(comment.date).toLocaleTimeString()}
                                            </Typography>
                                            <Button
                                              size="small"
                                              startIcon={<ThumbUp />}
                                              onClick={() => handleLikeComment(article._id, comment._id)}
                                              sx={{ minWidth: 'auto', p: 0.5 }}
                                            >
                                              {comment.likes || 0}
                                            </Button>
                                          </Box>
                                        </Paper>
                                      </Box>
                                    </Box>
                                  </Box>
                                ))
                              ) : (
                                <Typography variant="body2" color="textSecondary" textAlign="center" py={2}>
                                  No comments yet. Be the first to comment!
                                </Typography>
                              )}
                            </Paper>
                          </Collapse>
                        </Box>
                      </CardContent>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            ))}
            
            {filteredNews.length === 0 && !loading && (
              <Grid item xs={12}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h6" color="textSecondary">
                    No news found
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Try adjusting your search terms or category filter
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Latest Updates */}
          <Card sx={{ mb: 2 }} elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Latest Updates
              </Typography>
              <List dense>
                {news.slice(0, 5).map((item, index) => (
                  <React.Fragment key={item._id}>
                    <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {item.title}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="textSecondary">
                            {new Date(item.date).toLocaleDateString()} • {item.location}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < 4 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Important Announcements */}
          <Card elevation={2} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Important Announcements
              </Typography>
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Anchor Borrowers Programme Registration"
                    secondary="CBN deadline: March 31, 2024"
                  />
                </ListItem>
                <Divider />
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="FADAMA III Beneficiary Selection"
                    secondary="Visit your local ADP office"
                  />
                </ListItem>
                <Divider />
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Agric Insurance Scheme"
                    secondary="NIRSAL registration ongoing"
                  />
                </ListItem>
                <Divider />
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Youth in Agriculture Programme"
                    secondary="Applications close Feb 28, 2024"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Stats
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Total News:</Typography>
                  <Typography variant="body2" fontWeight="bold">{news.length}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Government Updates:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {news.filter(item => item.category === 'Government').length}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Market Reports:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {news.filter(item => item.category === 'Market').length}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Tech Updates:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {news.filter(item => item.category === 'Technology').length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Menu for Edit/Delete */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleEditNews(news.find(n => n._id === selectedNewsId))}>
          <Edit sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleDeleteNews(selectedNewsId)} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Post/Edit News Dialog */}
      <Dialog 
        open={openPostDialog} 
        onClose={() => {
          setOpenPostDialog(false);
          setEditingNews(null);
          resetNewPost();
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingNews ? 'Edit Agricultural News' : 'Post Agricultural News'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="News Title"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                required
                error={!newPost.title}
                helperText={!newPost.title ? "Title is required" : ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Author/Source"
                value={newPost.author}
                onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                required
                error={!newPost.author}
                helperText={!newPost.author ? "Author is required" : ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Category"
                value={newPost.category}
                onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                SelectProps={{ native: true }}
              >
                <option value="Government">Government</option>
                <option value="Market">Market</option>
                <option value="Technology">Technology</option>
                <option value="Weather">Weather</option>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location (e.g., Lagos, Nigeria)"
                value={newPost.location}
                onChange={(e) => setNewPost({ ...newPost, location: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Summary"
                multiline
                rows={2}
                value={newPost.summary}
                onChange={(e) => setNewPost({ ...newPost, summary: e.target.value })}
                required
                error={!newPost.summary}
                helperText={!newPost.summary ? "Summary is required" : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Content"
                multiline
                rows={4}
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                required
                error={!newPost.content}
                helperText={!newPost.content ? "Content is required" : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={2}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="image-upload"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                                        component="span"
                    startIcon={<PhotoCamera />}
                  >
                    Upload Image
                  </Button>
                </label>
                {newPost.image && (
                  <Typography variant="body2" color="textSecondary">
                    {newPost.image.name}
                  </Typography>
                )}
                {editingNews && editingNews.image && !newPost.image && (
                  <Typography variant="body2" color="textSecondary">
                    Current image will be kept if no new image is uploaded
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tags (comma separated)"
                value={newPost.tags}
                onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                placeholder="e.g., farming, technology, government"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenPostDialog(false);
            setEditingNews(null);
            resetNewPost();
            setError('');
          }}>
            Cancel
          </Button>
          <Button 
            onClick={handlePostNews}
            variant="contained"
            disabled={loading || !newPost.title || !newPost.summary || !newPost.content || !newPost.author}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? (editingNews ? 'Updating...' : 'Posting...') : (editingNews ? 'Update News' : 'Post News')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default News;
