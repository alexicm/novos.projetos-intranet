import { CourseList } from '@/components/CourseList'

export default function MainPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Propostas de Cursos</h1>
      <CourseList />
    </div>
  )
}

