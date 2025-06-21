"use client"

import { useState } from "react"
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
import { completeOnboarding } from "@/app/actions/user"

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [useCase, setUseCase] = useState("clean-speech")
  const [storeMemory, setStoreMemory] = useState(false)

  const handleFinish = async () => {
    // Here you would typically save the user's choices (useCase, storeMemory)
    // For now, we'll just complete the onboarding
    try {
      await completeOnboarding()
    } catch (error) {
      console.error("Failed to complete onboarding:", error)
      // Handle error appropriately in the UI
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
              <Label htmlFor="mic-permission">Microphone Access</Label>
              <Button variant="outline" id="mic-permission">
                Request
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="accessibility-permission">
                Accessibility Permissions
              </Label>
              <Button variant="outline" id="accessibility-permission">
                Request
              </Button>
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
            <Button onClick={handleFinish}>Finish</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
} 