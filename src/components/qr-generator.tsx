"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Type, User } from "lucide-react";
import QRCode from "qrcode";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createVCard } from "@/lib/vcard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";

type QrGeneratorProps = {
  onQrGenerated: (value: string, dataUrl: string) => void;
};

const urlSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }),
});

const textSchema = z.object({
  text: z.string().min(1, { message: "Text cannot be empty." }),
});

const vCardSchema = z.object({
  prefix: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  phone: z.string().min(1, "Phone number is required"),
  company: z.string().optional(), // Organization
  jobTitle: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(), // state/province
  postcode: z.string().optional(), // zip
  country: z.string().optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal('')),
});


export function QrGenerator({ onQrGenerated }: QrGeneratorProps) {
  const { toast } = useToast();

  const urlForm = useForm<z.infer<typeof urlSchema>>({
    resolver: zodResolver(urlSchema),
    defaultValues: { url: "" },
  });

  const textForm = useForm<z.infer<typeof textSchema>>({
    resolver: zodResolver(textSchema),
    defaultValues: { text: "" },
  });

  const vCardForm = useForm<z.infer<typeof vCardSchema>>({
    resolver: zodResolver(vCardSchema),
    mode: "onChange",
    defaultValues: {
      prefix: "",
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      company: "",
      jobTitle: "",
      street: "",
      city: "",
      region: "",
      postcode: "",
      country: "",
      website: "",
    },
  });

  const generateQr = async (value: string) => {
    try {
      const dataUrl = await QRCode.toDataURL(value, {
        errorCorrectionLevel: "H",
        width: 512,
        margin: 2,
      });
      onQrGenerated(value, dataUrl);
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "QR Generation Failed",
        description: "Could not generate QR code. Please try again.",
      });
    }
  };

  const onUrlSubmit = (data: z.infer<typeof urlSchema>) => generateQr(data.url);
  const onTextSubmit = (data: z.infer<typeof textSchema>) => generateQr(data.text);
  const onVCardSubmit = (data: z.infer<typeof vCardSchema>) => {
    const vCardString = createVCard(data);
    generateQr(vCardString);
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full grid-cols-3 gap-2 p-0 bg-transparent h-auto">
          <TabsTrigger value="url" className="h-24 flex-col gap-2 border-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-lg rounded-lg bg-card p-4 transition-all hover:bg-muted/50">
            <Link className="size-8 text-muted-foreground data-[state=active]:text-primary" />
            <span className="text-md font-semibold text-foreground">URL</span>
          </TabsTrigger>
          <TabsTrigger value="text" className="h-24 flex-col gap-2 border-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-lg rounded-lg bg-card p-4 transition-all hover:bg-muted/50">
            <Type className="size-8 text-muted-foreground data-[state=active]:text-primary" />
            <span className="text-md font-semibold text-foreground">Text</span>
          </TabsTrigger>
          <TabsTrigger value="vcard" className="h-24 flex-col gap-2 border-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-lg rounded-lg bg-card p-4 transition-all hover:bg-muted/50">
            <User className="size-8 text-muted-foreground data-[state=active]:text-primary" />
            <span className="text-md font-semibold text-foreground">Contact</span>
          </TabsTrigger>
        </TabsList>
        
        <Card className="mt-8">
          <TabsContent value="url" className="m-0">
            <CardHeader>
              <CardTitle>Website URL</CardTitle>
              <CardDescription>Enter the full URL you want the QR code to link to.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...urlForm}>
                <form onSubmit={urlForm.handleSubmit(onUrlSubmit)} className="space-y-6">
                  <FormField
                    control={urlForm.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={urlForm.formState.isSubmitting}>Generate QR Code</Button>
                </form>
              </Form>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="text" className="m-0">
            <CardHeader>
              <CardTitle>Plain Text</CardTitle>
              <CardDescription>Enter any text, like a message or a piece of information.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...textForm}>
                <form onSubmit={textForm.handleSubmit(onTextSubmit)} className="space-y-6">
                  <FormField
                    control={textForm.control}
                    name="text"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea placeholder="Enter any text here..." className="resize-none h-32" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={textForm.formState.isSubmitting}>Generate QR Code</Button>
                </form>
              </Form>
            </CardContent>
          </TabsContent>

          <TabsContent value="vcard" className="m-0">
             <CardHeader>
              <CardTitle>Contact Card</CardTitle>
              <CardDescription>Fill out the form to create a vCard for sharing contact details.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...vCardForm}>
                <form onSubmit={vCardForm.handleSubmit(onVCardSubmit)} className="space-y-4">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-3">
                      <FormField control={vCardForm.control} name="prefix" render={({ field }) => ( <FormItem><FormLabel>Prefix</FormLabel><FormControl><Input placeholder="Mr./Dr." {...field} /></FormControl><FormMessage /></FormItem> )} />
                    </div>
                    <div className="col-span-9">
                      <FormField control={vCardForm.control} name="firstName" render={({ field }) => ( <FormItem><FormLabel>First Name <span className="text-destructive">*</span></FormLabel><FormControl><Input placeholder="John" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    </div>
                  </div>
                   <FormField control={vCardForm.control} name="lastName" render={({ field }) => ( <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input placeholder="Doe" {...field} /></FormControl><FormMessage /></FormItem> )} />
                   <FormField control={vCardForm.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="john.doe@email.com" {...field} /></FormControl><FormMessage /></FormItem> )} />
                   <FormField control={vCardForm.control} name="phone" render={({ field }) => ( <FormItem><FormLabel>Phone <span className="text-destructive">*</span></FormLabel><FormControl><Input placeholder="+1 123 456 7890" {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={vCardForm.control} name="company" render={({ field }) => ( <FormItem><FormLabel>Organization</FormLabel><FormControl><Input placeholder="ACME Inc." {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={vCardForm.control} name="jobTitle" render={({ field }) => ( <FormItem><FormLabel>Job Title</FormLabel><FormControl><Input placeholder="Manager" {...field} /></FormControl><FormMessage /></FormItem> )} />
                  </div>
                  <FormField control={vCardForm.control} name="street" render={({ field }) => ( <FormItem><FormLabel>Street</FormLabel><FormControl><Input placeholder="123 Main St" {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={vCardForm.control} name="city" render={({ field }) => ( <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="Anytown" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={vCardForm.control} name="region" render={({ field }) => ( <FormItem><FormLabel>Region</FormLabel><FormControl><Input placeholder="State / Province" {...field} /></FormControl><FormMessage /></FormItem> )} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={vCardForm.control} name="postcode" render={({ field }) => ( <FormItem><FormLabel>Postcode</FormLabel><FormControl><Input placeholder="Zip / Postal" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={vCardForm.control} name="country" render={({ field }) => ( <FormItem><FormLabel>Country</FormLabel><FormControl><Input placeholder="Country" {...field} /></FormControl><FormMessage /></FormItem> )} />
                  </div>
                  <FormField control={vCardForm.control} name="website" render={({ field }) => ( <FormItem><FormLabel>Website</FormLabel><FormControl><Input placeholder="https://acme.inc" {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <Button type="submit" className="w-full !mt-8" size="lg" disabled={vCardForm.formState.isSubmitting}>Generate Contact QR</Button>
                </form>
              </Form>
            </CardContent>
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
}
