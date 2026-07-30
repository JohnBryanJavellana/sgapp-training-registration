import ReCAPTCHA from 'react-google-recaptcha';

interface CustomRecaptchaProps {
    callbackFunction: (e: any) => void
}

export default function CustomRecaptcha({ callbackFunction }: CustomRecaptchaProps) {
    const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY;

    return (
        <>
            <ReCAPTCHA
                size="normal"
                type='image'
                sitekey={String(recaptchaSiteKey)}
                onChange={(e) => { callbackFunction(e); }}
                onErrored={() => callbackFunction(null)}
            />
        </>
    )
}