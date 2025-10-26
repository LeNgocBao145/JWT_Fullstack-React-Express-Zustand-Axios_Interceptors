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
import useAuthStore from "@/stores/authStore";
import { useNavigate } from "react-router";

const signInFormSchema = z.object({
  userName: z.string().min(3, "Username is at least 3 characters"),
  password: z.string().min(9, "Password must be at least 9 characters"),
});

type SignInFormType = z.infer<typeof signInFormSchema>;

export function SigninForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {signIn} = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormType>({
    resolver: zodResolver(signInFormSchema),
  });

  const onSubmit = async (data: SignInFormType) => {
    try {
      const {userName, password} = data;
      await signIn(userName, password);
      navigate("/");
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
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Sign in your Moji account
                </p>
              </div>            
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
                  Sign in
                </Button>
              </Field>
              <FieldDescription className="text-center">
                You don't have account? <a href="/signup">Sign up</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholder.png"
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
