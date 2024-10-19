import {
  PermMedia,
  Label,
  Room,
  EmojiEmotions,
  Cancel,
} from "@mui/icons-material";
import { Form, useActionData } from "react-router-dom";
import classes from "./Share.module.css";
import { useState } from "react";
import { useSelector } from "react-redux";
const Share = () => {
  const resStatus = useActionData();
  const [file, setFile] = useState();
  const user = useSelector((state) => state.user);
  const cancelHandler = () => {
    setFile(null);
  };
  return (
    <section className={classes.topSection}>
      {resStatus && resStatus !== 200 && <p className="error">Server Error</p>}
      <Form method="POST" encType="multipart/form-data">
        <div className={classes.topSection__input}>
          <img
            className={classes.profileImg}
            src={`https://chitchatt.s3.ap-south-1.amazonaws.com/${
              user?.profilePicture || "uploads/no_avatar.jpg"
            }`}
            alt="profilePic"
          />

          <input type="text" placeholder="Share your thoughts..." name="desc" />
        </div>

        <hr className={classes.hr} />
        {file && (
          <div className={classes.selectionImg}>
            <img src={URL.createObjectURL(file)} alt="selected pic" />
            <button onClick={cancelHandler}>
              <Cancel />
            </button>
          </div>
        )}

        <div className={classes.topSection__bottom}>
          <section className={classes.topSection__options}>
            <label htmlFor="file">
              <PermMedia htmlColor="tomato" />
              <span className={classes.iconTitle}>Photo or Video</span>
              <input
                type="file"
                accept=".jpeg,.png,.jpg"
                id="file"
                style={{ display: "none" }}
                name="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            <label>
              <Label htmlColor="blue" />
              <span className={classes.iconTitle}>Tag</span>
            </label>
            <label>
              <Room htmlColor="red" />
              <span className={classes.iconTitle}>Location</span>
            </label>
            <label>
              <EmojiEmotions htmlColor="goldenrod" />
              <span className={classes.iconTitle}>Feelings</span>
            </label>
          </section>

          <button className={classes.shareBtn}>Share</button>
        </div>
      </Form>
    </section>
  );
};
export default Share;

export const shareAction = async ({ request }) => {
  const formData = await request.formData();
  const data = new FormData();
  data.append("userId", localStorage.getItem("userId"));
  data.append("desc", formData.get("desc"));
  data.append("postImage", formData.get("file"));
  const response = await fetch("http://localhost:8080/api/post/new", {
    method: "POST",
    body: data,
    credentials: "include",
  });

  window.location.reload();
  return response.status;
};
