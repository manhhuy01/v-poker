export default function Profile({ user }) {
  return (
    <div className="flex items-center mb-2 mt-2 cursor-pointer">
      <span className={`${user?.isDealer ? 'text-red-500' : 'text-green-500'}`}>
        {
          user.isDealer ? '♛' : '◯'
        }
      </span>
      <p className="font-bold ml-2 text-white">{user?.userName}</p>
      <p className="ml-2 text-white">${user?.accBalance}</p>
    </div>
  )
}