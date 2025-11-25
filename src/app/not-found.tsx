import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold">페이지를 찾을 수 없습니다</h2>
      <p className="mb-4 text-gray-500">요청하신 페이지가 존재하지 않습니다.</p>
      <Link href="/" className="text-blue-500 hover:underline">홈으로 돌아가기</Link>
    </div>
  )
}