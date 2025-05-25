import { Metadata } from 'next'
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FolderIcon } from "lucide-react"

export const metadata: Metadata = {
  title: 'Categories | Your Store',
  description: 'Browse all product categories',
}

export default function CategoriesPage() {
  // Example categories - in a real app these would likely come from an API or database
  const categories = [
    { id: 1, name: "Electronics", description: "Gadgets and devices" },
    { id: 2, name: "Clothing", description: "Fashion and apparel" },
    { id: 3, name: "Home & Living", description: "Furniture and decor" },
    { id: 4, name: "Books", description: "Books and literature" },
  ]

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <FolderIcon className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Categories</h1>
      </div>
      
      <Separator className="mb-8" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
              <p className="text-gray-600">{category.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}