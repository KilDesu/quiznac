type NotificationType = "success" | "error" | "info";

export default (message: string, type: NotificationType = "success") => {
  const classes =
    type === "success"
      ? "primary-container"
      : type === "error"
        ? "error-container"
        : "tertiary-fixed";

  const icon =
    type === "success" ? "sym_r_check_circle" : type === "error" ? "sym_r_error" : "sym_r_info";

  const textColor =
    type === "success"
      ? "on-primary-container"
      : type === "error"
        ? "on-error-container"
        : "on-tertiary-fixed";

  return Notify.create({
    position: "top-right",
    message,
    classes,
    icon,
    textColor,
    attrs: {
      style: "border-radius: 0.75rem",
    },
  });
};
