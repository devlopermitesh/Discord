'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useModel } from '@/hooks/use-model'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Type } from '@/lib/generated/prisma/enums'
import { ENDPOINTS } from '@/config'
import { createchannelSchema } from '@/schema/channel-schema'
import queryString from 'query-string'

const EditChannelModel = () => {
  const [IsMounted, setIsMounted] = useState(false)
  const { onClose, isOpen, modelType, data } = useModel()
  const router = useRouter()
  const { server, channel } = data
  useEffect(() => {
    setIsMounted(true)
  }, [])
  const form = useForm<z.infer<typeof createchannelSchema>>({
    resolver: zodResolver(createchannelSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      title: channel?.title,
      type: channel?.type,
    },
  })

  async function onSubmit(values: z.infer<typeof createchannelSchema>) {
    try {
      if (!channel) {
        throw Error('Channel Id is not correct!')
      }
      const query = queryString.stringifyUrl({
        url: ENDPOINTS.editchannel(channel.id),
        query: { serverId: server?.id },
      })
      await axios.patch(query, values)

      // Success handling
      form.reset()
      router.refresh()
      window.location.reload()
      onClose()
      toast.success('channel update successfully!')
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

  if (!IsMounted) return null
  return (
    <Dialog open={isOpen && modelType === 'editchannel'} onOpenChange={(open) => onClose()}>
      <DialogContent
        className="
    bg-background text-primary
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
            Create Channel
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormControl>
                    <Input
                      placeholder="Enter your channel name"
                      className="text-sm sm:text-base"
                      {...field}
                    />
                  </FormControl>

                  <FormDescription className="text-xs text-muted-foreground">
                    Channel name cant be general
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-base font-medium">Select Channel type</FormLabel>

                  <FormControl>
                    <Select defaultValue={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(Type).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={!form.formState.isValid}
              className="w-full bg-purple-600  hover:bg-purple-700 rounded-sm cursor-pointer"
            >
              Create Channel
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditChannelModel
