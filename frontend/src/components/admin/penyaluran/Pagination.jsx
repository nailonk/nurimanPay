import { Button } from "@/components/ui/button"

export default function Pagination() {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" size="sm">1</Button>
      <Button variant="ghost" size="sm">2</Button>
      <Button variant="ghost" size="sm">3</Button>
    </div>
  )
}