"use client"

import { useState } from "react"
import { useAuth, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { IconMicrophone, IconShield, IconCheck, IconX } from "@tabler/icons-react"
import { completeOnboarding } from "@/app/actions/user"

export default function OnboardingPage() {
  const { isLoaded, userId } = useAuth()
  const { user } = useUser()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [useCase, setUseCase] = useState("clean-speech")
  const [storeMemory, setStoreMemory] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [microphonePermission, setMicrophonePermission] = useState<'pending' | 'granted' | 'denied'>('pending')
  const [accessibilityPermission, setAccessibilityPermission] = useState<'pending' | 'granted' | 'denied'>('pending')

  // Redirect to sign-in if not authenticated
  if (isLoaded && !userId) {
    router.push("/sign-in")
    return null
  }

  const requestMicrophoneAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setMicrophonePermission('granted')
      // Stop the stream immediately as we just needed permission
      stream.getTracks().forEach(track => track.stop())
    } catch (error) {
      console.error('Microphone access denied:', error)
      setMicrophonePermission('denied')
    }
  }

  const requestAccessibilityPermission = async () => {
    try {
      // Check if we're in an Electron environment
      if (typeof window !== 'undefined' && (window as any).electronAPI) {
        // Call Electron main process to request accessibility permissions
        const granted = await (window as any).electronAPI.requestAccessibilityPermissions()
        
        if (!granted) {
          // Provide detailed instructions for granting accessibility permissions
          alert(
            "To enable copy/paste and system interactions, please:\n\n" +
            "1. Open System Preferences (System Settings on macOS 13+)\n" +
            "2. Go to Security & Privacy > Privacy\n" +
            "3. Select 'Accessibility' from the left sidebar\n" +
            "4. Click the lock icon and enter your password\n" +
            "5. Check the box next to this app\n" +
            "6. Restart the app if needed\n\n" +
            "This allows the app to copy/paste text and interact with other applications."
          )
        }
        
        setAccessibilityPermission(granted ? 'granted' : 'denied')
      } else {
        // For web/development, we'll simulate the permission request
        alert(
          "This app needs accessibility permissions to enable copy/paste functionality.\n\n" +
          "In the desktop app, this would open macOS System Preferences > Security & Privacy > Privacy > Accessibility"
        )
        setAccessibilityPermission('granted') // Assume granted for web testing
      }
    } catch (error) {
      console.error('Accessibility permission request failed:', error)
      setAccessibilityPermission('denied')
    }
  }

  const handleFinish = async () => {
    if (!user) return
    
    setIsCompleting(true)
    try {
      // Call server action to update user metadata
      await completeOnboarding({
        useCase,
        storeMemory,
        microphonePermission,
        accessibilityPermission,
      })
      
      // Navigation will be handled by the server action redirect
    } catch (error) {
      console.error("Failed to complete onboarding:", error)
      setIsCompleting(false)
    }
  }

  // Show loading state while auth is loading
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  const getPermissionIcon = (permission: 'pending' | 'granted' | 'denied') => {
    switch (permission) {
      case 'granted':
        return <IconCheck className="h-4 w-4 text-green-500" />
      case 'denied':
        return <IconX className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getPermissionText = (permission: 'pending' | 'granted' | 'denied') => {
    switch (permission) {
      case 'granted':
        return 'Granted'
      case 'denied':
        return 'Denied'
      default:
        return 'Request'
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      {step === 1 && (
        <Card className="w-[450px]">
          <CardHeader>
            <CardTitle>Onboarding - Step 1 of 2</CardTitle>
            <CardDescription>
              What will you mainly use this for?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              defaultValue={useCase}
              onValueChange={(value) => setUseCase(value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="clean-speech" id="r1" />
                <Label htmlFor="r1">Clean my speech</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="formalize" id="r2" />
                <Label htmlFor="r2">Formalize what I say</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="summarize" id="r3" />
                <Label htmlFor="r3">Summarize what I rambled</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="voice-prompt" id="r4" />
                <Label htmlFor="r4">Use my voice as prompt to bots</Label>
              </div>
            </RadioGroup>
          </CardContent>
          <CardFooter>
            <Button onClick={() => setStep(2)}>Continue</Button>
          </CardFooter>
        </Card>
      )}

      {step === 2 && (
        <Card className="w-[450px]">
          <CardHeader>
            <CardTitle>Onboarding - Step 2 of 2</CardTitle>
            <CardDescription>
              Permissions and Personalization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <IconMicrophone className="h-4 w-4" />
                <Label htmlFor="mic-permission">Microphone Access</Label>
              </div>
              <div className="flex items-center space-x-2">
                {getPermissionIcon(microphonePermission)}
                <Button 
                  variant="outline" 
                  id="mic-permission"
                  onClick={requestMicrophoneAccess}
                  disabled={microphonePermission !== 'pending'}
                >
                  {getPermissionText(microphonePermission)}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <IconShield className="h-4 w-4" />
                <Label htmlFor="accessibility-permission">
                  Accessibility (for copy/paste)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                {getPermissionIcon(accessibilityPermission)}
                <Button 
                  variant="outline" 
                  id="accessibility-permission"
                  onClick={requestAccessibilityPermission}
                  disabled={accessibilityPermission !== 'pending'}
                >
                  {getPermissionText(accessibilityPermission)}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="memory-personalization">
                Store memory for personalization
              </Label>
              <Switch
                id="memory-personalization"
                checked={storeMemory}
                onCheckedChange={setStoreMemory}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button onClick={handleFinish} disabled={isCompleting}>
              {isCompleting ? "Finishing..." : "Finish"}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
} 