import { LoaderCircle } from 'lucide-react'

export default function Loading() {
   return (
      <div
         style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh'
         }}
      >
         <LoaderCircle size={48} className="animate-spin" />
         <span style={{ marginTop: 16, fontSize: 16 }}>Loading...</span>
      </div>
   )
}
