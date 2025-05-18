import { useRoute, useNavigation } from '@react-navigation/native';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getCommentsByThreadId } from '../services/commentService';
import Feed from './Feed';
import { database } from '../../FirebaseConfig';
import { ref, onValue, off, query, orderByChild, equalTo } from 'firebase/database';
import useFetch from '../services/useFetch';

const buildCommentTree = (comments) => {
  const commentMap = {};
  const roots = [];

  comments.forEach((comment) => {
    commentMap[comment.id] = { ...comment, replies: [] };
  });

  comments.forEach((comment) => {
    if (comment.parentId) {
      commentMap[comment.parentId]?.replies.push(commentMap[comment.id]);
    } else {
      roots.push(commentMap[comment.id]);
    }
  });

  return roots;
};

const CommentItem = ({ comment, level = 0, onReply }) => {
  const isFirstComment = level === 0 && comment.parentId === null;

  return (
    <View style={[styles.commentContainer, { marginLeft: level*20}]}>
      {isFirstComment && (
        <View style={styles.connector}>
          <View style={styles.line} />
        </View>
      )} 
      <Feed thread={comment} onReply={onReply} />
      {comment.replies?.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          level={level + 1}
          onReply={onReply}
        />
      ))}
    </View>
  );
};

const Comments = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params || {};
  const [comments, setComments] = useState([]);
  const [commentTree, setCommentTree] = useState([]);
  const { data: commentLists, refetch } = useFetch(() => getCommentsByThreadId(id), true);

  useEffect(()=> {
    refetch()
  }, [id])
  
  useEffect(() => {
    console.log('Thread ID trong Binh luan:', id);
    if (!id) {
      console.error('Khong co id o pagram');
      setComments([]);
      setCommentTree([]);
      return;
    }
      if (commentLists) {
        console.log('Fetched comments for thread ID', id, ':', commentLists);
        setComments(commentLists);
        const tree = buildCommentTree(commentLists);
        setCommentTree(tree);
      } else {
        console.log('No comments found for thread ID:', id);
        setComments([]);
        setCommentTree([]);
      }
    
    
    // return () => off(commentsRef, 'value', unsubscribe);
  }, [id, commentLists]);

  const handleReply = (parentId) => {
    if (!id) {
      console.error('Thieu threadId của bai viet cha');
      return;
    }
    console.log('threadId:', id, 'va parentId:', parentId);
    navigation.navigate('Reply', { threadId: id, parentId });
  };

  if (!id) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.emptyText}>Lỗi: Thiếu ID bài đăng</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={commentTree}
      renderItem={({ item }) => (
        <CommentItem
          comment={item}
          onReply={() => handleReply(item.id)}
        />
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      ItemSeparatorComponent={() => (
        <View className='border-b-2 border-b-gray-300' />
      )}
      ListEmptyComponent={<Text style={styles.emptyText}>Chưa có bình luận nào</Text>}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  commentContainer: {
    position: 'relative',
  },
  connector: {
    position: 'absolute',
    left: 33,
    top: -50,
    alignItems: 'center',
  },
  line: {
    width: 2,
    height: 40,
    backgroundColor: '#ccc',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Comments;