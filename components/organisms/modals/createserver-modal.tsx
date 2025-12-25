'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import UploadserverImage from '@/components/atoms/upload-serverImage'
import { Button } from '@/components/ui/button'
import { createServerSchema } from '@/schema/server-schema'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useModel } from '@/hooks/use-model'

const CreateServerModal = () => {
  const { isOpen, modelType, onClose } = useModel()
  const router = useRouter()

  const form = useForm<z.infer<typeof createServerSchema>>({
    resolver: zodResolver(createServerSchema),
    defaultValues: {
      title: '',
      description: '',
      imageUrl: null,
    },
  })

  async function onSubmit(values: z.infer<typeof createServerSchema>) {
    try {
      await axios.post('/api/servers', values)

      // Success handling
      form.reset()
      router.refresh()
      window.location.reload()

      toast.success('Server created successfully!')
    } catch (error: unknown) {
      // Type guard for Axios errors
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          'Something went wrong'

        toast.error(errorMessage)
      } else if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Something went wrong')
      }
    }
  }
  const handleClose = () => {
    form.reset()
    onClose()
  }
  return (
    <Dialog open={isOpen && modelType == 'createServer'} onOpenChange={handleClose}>
      <DialogContent
        className="
    bg-white text-black 
    overflow-y-auto 
    max-h-[90vh] 
    sm:max-h-[85vh] 
    rounded-xl 
    p-6 
    sm:p-8
    no-scrollbar
  "
      >
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl sm:text-2xl font-semibold tracking-tight">
            Customize your Server
          </DialogTitle>

          <DialogDescription className="text-sm text-muted-foreground">
            Give your server a title and an image. You can always change it later.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Image Upload */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-base font-medium">Server Image</FormLabel>

                  <FormControl>
                    <UploadserverImage currentUrl={field.value ?? null} onChange={field.onChange} />
                  </FormControl>

                  <FormDescription className="text-xs text-muted-foreground">
                    Upload a cool icon for your server.
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-base font-medium">Title</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Enter your server title"
                      className="text-sm sm:text-base"
                      {...field}
                    />
                  </FormControl>

                  <FormDescription className="text-xs text-muted-foreground">
                    This is your public server name.
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-base font-medium">Description</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Describe what your server is about"
                      className="text-sm sm:text-base"
                      {...field}
                    />
                  </FormControl>

                  <FormDescription className="text-xs text-muted-foreground">
                    Description is publicly visible on your server profile.
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={!form.formState.isValid}
              className="w-full bg-purple-600  hover:bg-purple-700 rounded-sm cursor-pointer"
            >
              Create
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateServerModal
