import mongoose from "mongoose";

const Schema = mongoose.Schema;

const SessionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [{ type: Schema.Types.ObjectId, ref: "Item", required: true }],
    type: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model("ReviewSession", SessionSchema);
