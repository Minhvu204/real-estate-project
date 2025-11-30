import {
  createPropertyReview,
<<<<<<< HEAD
  deleteReview,
  editReview,
=======
>>>>>>> develop
  getAllReviewPropertyById,
} from "../../services/buyerService";
import type { Review } from "../../types/Review";
import { useEffect, useState } from "react";
import {
  Button,
  Rating,
  TextField,
  Typography,
  Box,
  Divider,
  Stack,
<<<<<<< HEAD
  Avatar,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getLanguage, getUser, type Lang } from "../../utils/storage";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
=======
} from "@mui/material";
>>>>>>> develop

interface PropsProperty {
  propertyId: string;
}

const PropertyReview = ({ propertyId }: PropsProperty) => {
  const [review, setReview] = useState<Review[]>([]);
  const [comment, setComment] = useState<string>("");
  const [rating, setRating] = useState<number | null>(0);
<<<<<<< HEAD
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [canReview, setCanReview] = useState<boolean>(false);
  const [isComment, setIsComment] = useState<boolean>(false);
  const user = getUser();
  const currentLanguage: Lang = getLanguage();
  const { t } = useTranslation("comment");
  useEffect(() => {
    const fetchReview = async () => {
      const res = await getAllReviewPropertyById(propertyId);
      console.log("review: ", res);
      setReview(res.reviews);
      setCanReview(res.canReview);
      setIsComment(res.isCommented);
=======

  useEffect(() => {
    const fetchReview = async () => {
      const res = await getAllReviewPropertyById(propertyId);
      setReview(res);
>>>>>>> develop
    };
    fetchReview();
  }, [propertyId]);

<<<<<<< HEAD
  useEffect(() => {
    if (user && user.id) {
      console.log(user.id);
      setCurrentUserId(user.id);
    }
  }, [user]);

  const handleComment = async () => {
    if (!rating) {
      return;
    } else if (canReview === false) {
      toast.error(t("toast_error_review"));
      return;
    } else if (isComment === true && !editingReviewId) {
      toast.error(t("toast_error_comment"));
      return;
    }

    const target_type = "property";

    try {
      if (editingReviewId) {
        await editReview(editingReviewId, rating, comment);
        setEditingReviewId(null);
        toast.success(t("toast_success_edit"));
      } else {
        await createPropertyReview(propertyId, rating, comment, target_type);
        toast.success(t("toast_success_comment"));
      }
      const res = await getAllReviewPropertyById(propertyId);
      setReview(res.reviews);
      setCanReview(res.canReview);
      setIsComment(res.isCommented);
      setComment("");
      setRating(0);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteReview(id);
      const res = await getAllReviewPropertyById(propertyId);
      setReview(res.reviews);
      setCanReview(res.canReview);
      setIsComment(res.isCommented);
      toast.success(t("toast_success_delete_comment"));
    } catch (error) {
      toast.error(t("toast_error_delete_comment"));
      console.log("error: ", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setComment("");
    setRating(0);
  };

  const handleEdit = async (
    id: string,
    oldRating: number,
    oldComment: string
  ) => {
    setEditingReviewId(id);
    setRating(oldRating);
    setComment(oldComment);
    try {
      await editReview(id, rating!, comment);
      setComment("");
      setRating(0);
    } catch (err) {
      console.log("error: ", err);
=======
  const handleComment = async () => {
    if (!rating) return;
    const target_type = "property";
    try {
      await createPropertyReview(propertyId, rating, comment, target_type);
      const res = await getAllReviewPropertyById(propertyId);
      setReview(res);
      setComment("");
      setRating(0);
    } catch (error) {
      console.log("ko comment dc: ", error);
>>>>>>> develop
    }
  };

  return (
    <Box sx={{ maxWidth: 640, margin: "0 auto" }}>
      <Typography variant="h6" align="center" gutterBottom fontWeight={700}>
<<<<<<< HEAD
        {t("reviewAndComment")}
      </Typography>
      <Box sx={{ mb: 2 }}>
        <TextField
          label={t("enter_comment")}
=======
        Đánh giá & Bình luận
      </Typography>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Nhập bình luận..."
>>>>>>> develop
          multiline
          minRows={3}
          fullWidth
          variant="outlined"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Box sx={{ display: "flex", alignItems: "center", mt: 1, mb: 2 }}>
          <Typography sx={{ mr: 2 }}>Đánh giá:</Typography>
          <Rating
            name="property-rating"
            value={rating}
            onChange={(_, newValue) => setRating(newValue)}
          />
        </Box>
<<<<<<< HEAD
        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleComment}
            disabled={!rating || comment.trim() === ""}
            sx={{ width: 120 }}
          >
            {editingReviewId ? t("update") : t("comment")}
          </Button>

          {editingReviewId && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancelEdit}
              sx={{ width: 120 }}
            >
              {t("cancel_btn")}
            </Button>
          )}
        </Box>
      </Box>
      <Divider />
      <Typography variant="subtitle1" fontWeight={700} mb={2} mt={3}>
        {t("comment")}
=======
        <Button
          variant="contained"
          color="primary"
          onClick={handleComment}
          disabled={!rating || comment.trim() === ""}
          sx={{ mt: 1, width: 120, alignSelf: "flex-end" }}
        >
          Gửi
        </Button>
      </Box>
      <Divider />
      <Typography variant="subtitle1" fontWeight={700} mb={2} mt={3}>
        Các bình luận đã có
>>>>>>> develop
      </Typography>
      <Stack spacing={2}>
        {review?.map((item) => (
          <Box
            key={item._id}
            sx={{ p: 1, borderRadius: 2, background: "#fafafa" }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
<<<<<<< HEAD
              <Avatar
                alt={item.user_id.fullName}
                src={item.user_id.avatar}
                sx={{ mr: 2 }}
              />
=======
>>>>>>> develop
              <Typography fontWeight={600} sx={{ mr: 2 }}>
                {item.user_id.fullName}
              </Typography>
              <Rating value={item.rating} readOnly size="small" />
              <Typography sx={{ ml: 2 }} color="text.secondary" fontSize={13}>
                {item.createdAt &&
                  new Date(item.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
<<<<<<< HEAD
            <Typography variant="body2" sx={{ ml: 7 }}>
              {item.comment?.[currentLanguage]}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 1,
                gap: 1,
              }}
            >
              {currentUserId === item.user_id._id &&
                editingReviewId !== item._id && (
                  <>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() =>
                        handleEdit(item._id, item.rating, item.comment.vi)
                      }
                      aria-label="edit"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(item._id)}
                      aria-label="delete"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </>
                )}
            </Box>
=======
            <Typography variant="body2">{item.comment}</Typography>
>>>>>>> develop
          </Box>
        ))}
        {review?.length === 0 && (
          <Typography color="text.secondary" align="center">
<<<<<<< HEAD
            {t("no_comment")}
=======
            Chưa có bình luận nào.
>>>>>>> develop
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default PropertyReview;
