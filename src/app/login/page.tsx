"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { loginWithPassword, signInWithGoogle } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const schema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { email: "", password: "" },
    });

    const [state, formAction, isPending] = useActionState(
        async (_: unknown, formData: FormData) => {
            return loginWithPassword(formData);
        },
        null
    );

    useEffect(() => {
        if (state?.error) {
            toast.error(state.error);
        }
    }, [state]);

    async function handleGoogleClick() {
        const result = await signInWithGoogle();
        if (result.error) {
            toast.error(result.error);
            return;
        }
        if (result.url) {
            window.location.href = result.url;
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md bg-zinc-900">
                <CardHeader>
                    <CardTitle>Sign in</CardTitle>
                    <CardDescription>
                        Sign in with email or use Google to continue.
                    </CardDescription>
                </CardHeader>
                <form action={formAction}>
                    <CardContent className="space-y-4">
                        <Form {...form}>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="you@example.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </Form>
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? "Signing in…" : "Sign in"}
                        </Button>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-zinc-900 px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={handleGoogleClick}
                        >
                            Google
                        </Button>
                    </CardContent>
                </form>
                <CardFooter className="flex justify-center text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
                        Sign up
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
