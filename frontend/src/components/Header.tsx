interface HeaderProps {
    className?: string;
}

const Header = ({ className }: HeaderProps) => {
    return (
        <header className={`${className || 'header'}`}>
            <h1>GClock</h1>
            <p>gRPC web example using Go + ConnectRPC + React</p>
        </header>
    )
}

export default Header;