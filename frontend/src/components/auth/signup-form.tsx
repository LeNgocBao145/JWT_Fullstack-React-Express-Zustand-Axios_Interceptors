import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import useAuthStore from "@/stores/authStore";

const signUpFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  userName: z.string().min(3, "Username is at least 3 characters"),
  email: z.email("Invalid email address"),
  password: z.string().min(9, "Password must be at least 9 characters"),
});

type SignUpFormType = z.infer<typeof signUpFormSchema>;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {signUp} = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormType>({
    resolver: zodResolver(signUpFormSchema),
  });

  const onSubmit = async (data: SignUpFormType) => {
    try {
      const {firstName, lastName, userName, email, password} = data;
      await signUp(firstName, lastName, userName, email, password);
      navigate("/signin");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-border">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <a href="/" className="mx-auto block w-fit text-center">
                  <img src="/logo.svg" alt="Moji Logo" />
                </a>
                <h1 className="text-2xl font-bold">Create your Moji account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Welcome! Please sign up to begin!
                </p>
              </div>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="firstname">First Name</FieldLabel>
                    <Input
                      id="firstname"
                      type="text"
                      
                      {...register("firstName")}
                    />
                    {errors.firstName && (
                      <p className="text-destructive text-sm">
                        {errors.firstName.message}
                      </p>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="lastname">Last Name</FieldLabel>
                    <Input
                      id="lastname"
                      type="text"
                      
                      {...register("lastName")}
                    />
                    {errors.lastName && (
                      <p className="text-destructive text-sm">
                        {errors.lastName.message}
                      </p>
                    )}
                  </Field>
                </Field>
              </Field>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="moji123"
                  
                  {...register("userName")}
                />
                {errors.userName && (
                  <p className="text-destructive text-sm">
                    {errors.userName.message}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-destructive text-sm">
                    {errors.email.message}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-destructive text-sm">
                    {errors.password.message}
                  </p>
                )}
              </Field>
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  Create Account
                </Button>
              </Field>
              <FieldDescription className="text-center">
                Already have an account? <a href="/signin">Sign in</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholderSignUp.png"
              alt="Image"
              className="absolute top-1/2 -translate-y-1/2 object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance px-6 text-center *:[a]:hover:text-primary text-muted-foreground *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
