import { Outlet } from 'react-router-dom'
export  const AuthLayout = () => {
  return (
    <div className='min-h-screen w-full flex items-center justify-center  bg-[url(assets/img/auth-bg.jpg)] bg-center bg-cover bg-no-repeat'>
   {/* <div className="absolute inset-0 bg-black/30" /> */}
      <div className="z-10 w-full max-w-md p-4">
        <Outlet/>
      </div>

    </div>
  )
}
