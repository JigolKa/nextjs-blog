import * as Yup from "yup";
import { EMAIL_REGEX } from "../config";

export const validatePassword = (value: string | undefined): boolean => {
 if (value === undefined) return false;

 return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*[0-9]).{6,}$/.test(
  value
 );
};

export const loginSchema = Yup.object().shape({
 email: Yup.string()
  .email("Enter a valid email")
  .required("Email is required")
  .matches(EMAIL_REGEX, "Enter a valid email"),
 password: Yup.string()
  .min(8, "Password should be of minimum 8 characters length")
  .required("Password is required"),
});

export const signupSchema = Yup.object().shape({
 email: Yup.string()
  .email("Enter a valid email")
  .required("Email is required")
  .matches(EMAIL_REGEX, "Enter a valid email"),
 password: Yup.string()
  .min(8, "Password should be of minimum 8 characters length")
  .required("Password is required")
  .test(
   "one-uppercase character special character and a number",
   "Password must contain at least one uppercase letter, one special character and one number",
   (value) => validatePassword(value)
  ),
 passwordVerification: Yup.string().oneOf(
  [Yup.ref("password"), null],
  "Passwords must match"
 ),
 username: Yup.string().min(2, "Username should be of 2 characters minimum"),
});

export const updateSchema = {
 informations: Yup.object().shape({
  email: Yup.string()
   .email("Enter a valid email")
   .matches(EMAIL_REGEX, "Enter a valid email"),
  username: Yup.string().min(2, "Username should be of 2 characters minimum"),
 }),

 credentials: Yup.object().shape({
  password: Yup.string()
   .min(8, "Password should be of 8 characters minimum")
   .test(
    "one-uppercase character special character and a number",
    "Password must contain at least one uppercase letter, one special character and one number",
    (value) => validatePassword(value)
   ),
  passwordVerification: Yup.string().oneOf(
   [Yup.ref("password"), null],
   "Passwords must match"
  ),
 }),

 delete: Yup.object().shape({
  password: Yup.string().min(8, "Password should be of 8 characters minimum"),
  checked: Yup.boolean().required("Please confirm your account's deletion"),
 }),
};
