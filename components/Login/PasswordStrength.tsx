import { createStyles, Progress, useMantineTheme } from "@mantine/core";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import useStrength from "../../utils/validators/useStrength";

export interface PasswordStrengthProps {
 value: string;
}

const useStyles = createStyles((theme) => ({
 option: {
  display: "flex",
  gap: 5,
  alignItems: "center",
  fontSize: 14,
  color: theme.colors.gray[8],
 },
}));

export default function PasswordStrength({ value }: PasswordStrengthProps) {
 const { classes } = useStyles();
 const theme = useMantineTheme();

 const [score] = useStrength(value);

 return (
  <>
   <Progress
    radius="md"
    value={score}
    color={score <= 20 ? "red" : score <= 50 ? "orange" : "green"}
   />
   <div className={classes.option}>
    {value.length <= 8 ? (
     <AiOutlineClose size={24} color={theme.colors.red[7]} />
    ) : (
     <AiOutlineCheck color={theme.colors.green[7]} size={24} />
    )}
    <span>Should contains at least 8 characters</span>
   </div>
   <div className={classes.option}>
    {!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?À-ÿ]+/.test(value) ? (
     <AiOutlineClose size={24} color={theme.colors.red[7]} />
    ) : (
     <AiOutlineCheck color={theme.colors.green[7]} size={24} />
    )}
    <span>Should contains a special charater</span>
   </div>
   <div className={classes.option}>
    {!/\d/.test(value) ? (
     <AiOutlineClose size={24} color={theme.colors.red[7]} />
    ) : (
     <AiOutlineCheck color={theme.colors.green[7]} size={24} />
    )}
    <span>Should contains a number</span>
   </div>
   <div className={classes.option}>
    {!/[A-Z]/.test(value) ? (
     <AiOutlineClose size={24} color={theme.colors.red[7]} />
    ) : (
     <AiOutlineCheck color={theme.colors.green[7]} size={24} />
    )}
    <span>Should contains an uppercase letter</span>
   </div>
  </>
 );
}
