import { useState, useEffect } from 'react'

export default function Promo() {

    const [isDesktop, setIsDesktop] = useState(false);

    const checkWindowSize = () => {
        let windowWidth;
        if (typeof window !== 'undefined') {
            windowWidth = window.innerWidth;
        }
        if (windowWidth >= 1024) {
            setIsDesktop(true)
        }
        else {
            setIsDesktop(false)
        }
    }

    useEffect(() => {
        checkWindowSize()
    }, [isDesktop])

    if (typeof window !== 'undefined') {
        window.addEventListener('resize', checkWindowSize);
    }

    if (isDesktop) {
        return (
            <div style={{
                backgroundImage: 'url(/Capitol.png)',
                backgroundColor: '#345e9a',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                width: '100vw',
                height: '100vh'
            }}
            >
                <div style={{ textAlign: 'center', paddingTop: '2%' }}>
                    <img src="/Influencer.png" style={{ width: '50%' }}
                    />
                </div>

                <div style={{ textAlign: 'center', marginTop: '2%' }}>
                    <img src="/Beacon.png" style={{ width: '50%' }}
                    />
                </div>

                <img src="/Anniversary.png" style={{ float: 'left', marginLeft: '10%', width: '20%', cursor: 'pointer' }}
                    onClick={(e) => {
                        e.preventDefault();
                        window.location.href = '/?t=1&s=america';
                    }} />

                <img src="/Cover.png" style={{ float: 'right', marginRight: '10%', width: '20%', cursor: 'pointer' }}
                    onClick={(e) => {
                        e.preventDefault();
                        window.location.href = '/?t=1&s=america';
                    }}
                />

                <img src="/Logo.png" style={{
                    position: 'fixed',
                    left: '30%',
                    bottom: '5px',
                    transform: 'translate(0%, 0%)',
                    width: '40%',
                    margin: '0 auto',
                    cursor: 'pointer'
                }}
                    onClick={(e) => {
                        e.preventDefault();
                        window.location.href = '/?t=1&s=america';
                    }}
                />

            </div>
        )
    }
    return (
        <div style={{
            backgroundImage: 'url(/CapitolMobile.png)',
            backgroundColor: '#345e9a',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            width: '100vw',
            height: '100vh'
        }}
        >
            <div style={{ textAlign: 'center', paddingTop: '10%' }}>
                <img src="/Influencer.png" style={{ width: '90%' }}
                />
            </div>

            <div style={{ textAlign: 'center', marginTop: '10%', marginBottom: '16%' }}>
                <img src="/Beacon.png" style={{ width: '90%' }}
                />
            </div>

            <img src="/Anniversary.png" style={{
                position: 'fixed',
                top: '44%',
                left: '10%',
                transform: 'translateY(50%)',
                width: '40%',
                cursor: 'pointer'
            }}
                onClick={(e) => {
                    e.preventDefault();
                    window.location.href = '/?t=1&s=america';
                }} />

            <img src="/Cover.png" style={{
                position: 'fixed',
                top: '44%',
                left: '60%',
                transform: 'translateY(50%)',
                width: '40%',
                cursor: 'pointer'
            }}
                onClick={(e) => {
                    e.preventDefault();
                    window.location.href = '/?t=1&s=america';
                }}
            />

            <img src="/Logo.png" style={{
                position: 'fixed',
                left: '30%',
                bottom: '5px',
                transform: 'translate(0%, 0%)',
                width: '40%',
                margin: '0 auto',
                cursor: 'pointer'
            }}
                onClick={(e) => {
                    e.preventDefault();
                    window.location.href = '/?t=1&s=america';
                }}
            />

        </div>
    )
}
