// imports
import React, {useState} from "react";
import {Link} from "react-router-dom";

import {useHttpClient} from "../hooks/http-hook";
import {useAuth} from "../hooks/auth-hook";

import {updateIndexVal, validateEmail, updateError} from "../utils/utils";
import {inputs} from "../utils/inputs";
import verLogo from '../images/verification-state-img.svg';

// copy inputs
const updatedInputs = {...inputs};

// auth handler
const AuthHandler = () => {
    const { isLoading, sendRequest } = useHttpClient();
    const {token} = useAuth();

    // state
    const [terms, setTerms] = useState(false);
    const [step2, setStep2] = useState(false);
    const [step3, setStep3] = useState(false);
    const [error, setError] = useState('');
    const [inputsReg, setInputsReg] = useState([...updatedInputs.registerInputs]);
    const [inputsUp, setinputsUp] = useState([...updatedInputs.updateInputs]);


    // update inputs on change
    const handleInputChange = (e, index, form) => {
        if(form === 'updateReg'){
            const updatedInputs = [...inputsUp];
            updateIndexVal(updatedInputs, e, index);
            setinputsUp(updatedInputs);

            updateError(updatedInputs, index, e, 3);

        } else if (form === 'inputReg'){
            const updatedInputs = [...inputsReg];
            updateIndexVal(updatedInputs, e, index);
            setInputsReg(updatedInputs);

            updateError(updatedInputs, index, e, 6);

        }
    };

    // terms
    const handleTerms = (e) => {
        setTerms(e.target.checked);
    }

    // handle check email
    const handleCheckEmail = async (e) => {
        e.preventDefault();

        // store inputs value data in object
        const data = inputsReg.reduce((acc, cur) => {
            acc[cur.key] = cur.value;
            return acc;
        }, {});

        const {email, password} = data;
        const validatedEmail = validateEmail(email);

        // password error
        if(!password.length > 5 || password.length === 0 ){
            setError(' Password must be at least 6 digits')
        }

        // if email adrress is not valid
        if(!validatedEmail){
            setError('Please enter a valid email')
        }

        // if there's no accepted terms
        if(!terms){
            setError('Please accept t&c')
        }

        // submit - everythings fine
        if(validatedEmail && password.length > 5 && terms){

        try{
            const responseData = await sendRequest(
                'http://localhost:5000/users/email',
                'POST',
                {
                    'Content-Type': 'application/json'
                },
                JSON.stringify({email})
            )
            const response = await responseData;

            if(response.email) {
                setError('User already exists, please login instead');
            }  else {
                setError('');
                setStep2(true);
            }
        } catch (e) {}
        }

    }

    // sign up handler
    const handleSignUp = async (e) => {
        e.preventDefault();

        // store all inputs value in object
        const dataStep1 = inputsReg.reduce((acc, cur) => {
            acc[cur.key] = cur.value;
            return acc;
        }, {});

        const dataStep2 = inputsUp.reduce((acc, cur) => {
            acc[cur.key] = cur.value;
            return acc;
        }, {});

        // inputs data
        const mergedData = {...dataStep1, ...dataStep2};

        const {email, password, firstName, lastName, company, role} = mergedData;

        // password error
        if(!password.length > 5 || password.length === 0 ){
            setError(' password must be at least 6 digits')
        }

        // submit - everythings fine
        if(firstName.length > 1 && lastName.length > 1 && company.length > 1 && role.length > 1){
            // clear password
            setError('');

            try{
                const responseData = await sendRequest(
                    'http://localhost:5000/users/signup',
                    'POST',
                    {
                        'Content-Type': 'application/json'
                    },
                    JSON.stringify({email, password, firstName, lastName, company, role})
                )
                const response = await responseData;
                setStep3(true);

                // store user id in localstorage for activation use
                const userId = response.user;
                localStorage.setItem('userid', JSON.stringify(userId));
            } catch (e) {
                let error = e.toString();
                error = error.replace('Error:', '');
                setError(error);
            }
        }
    };

    // jsx
    return (<div>

            {!step2 ?
                <div>
                    <div className="headers-text">
                        <h3 className="headers-text__title">Register</h3>
                    </div>

                    {/* form */}
                    {!token ?
                        <form className="inputsForm registerForm" onSubmit={handleCheckEmail}>
                            <div className={`loader ${isLoading ? 'loader__active' : ''}`}>
                                <div className="lds-ripple">
                                    <div></div>
                                    <div></div>
                                </div>
                            </div>

                            {inputsReg.map( (item ,index) => {
                                return <div key={item.id} className="position-relative d-inline-block">
                                    <input type={item.type} id={item.id} onChange={e => handleInputChange(e, index, 'inputReg')} value={item.value} className="inputsForm__all"/>
                                    <label htmlFor={item.id} className="inputsForm__label">{item.label}</label>
                                    <div className="error">{item.error}</div>
                                </div>
                            })}

                            {/*  terms  */}
                            <fieldset className="termsForm d-flex">
                                <input type="checkbox" onChange={handleTerms}id="yesInput" className="termsForm__input d-none" name="yesInput"/>
                                <label htmlFor="yesInput"  className="termsForm__label">YES</label>
                                <span className="termsForm__agree text-left">I agree to the website <br /> <a>Terms and Conditions</a></span>
                            </fieldset>

                            <button>Create Account</button>
                            <span className="error">{error}</span>

                            <p className="inputsForm__login">Already have an account? <Link to="/login">Login</Link></p>
                        </form> :
                        <div>
                            <p className="headers-text__placeholder">You are logged.</p>
                            <p className="inputsForm__login">Go to <Link to="/login">Dasboard</Link></p>

                        </div>
                    }
                </div> :

             // step2
             <div>
                 {!step3 ?
                     <div>
                         <div className="headers-text">
                             <h3 className="headers-text__title">Basic Information</h3>
                             <p className="headers-text__placeholder">This is a placeholder description of why we
                                 need <br/> to know this type of information.</p>
                         </div>

                         {/* form */}
                         <form className="inputsForm registerForm" onSubmit={handleSignUp}>
                             <div className={`loader ${isLoading ? 'loader__active' : ''}`}>
                                 <div className="lds-ripple">
                                     <div></div>
                                     <div></div>
                                 </div>
                             </div>

                             {inputsUp.map((item, index) => {
                                 return <div key={item.id} className="position-relative d-inline-block">
                                     <input type={item.type} id={item.id}
                                            onChange={e => handleInputChange(e, index, 'updateReg')} value={item.value}
                                            className="inputsForm__all"/>
                                     <label htmlFor={item.id} className="inputsForm__label">{item.label}</label>
                                     <div className="error">{item.error}</div>
                                 </div>
                             })}

                             <button>Sign Up</button>
                             <span className="error">{error}</span>
                         </form>
                     </div> :

                     // activation mail sent
                     <div>
                         <div className="headers-text">
                             <img src={verLogo} alt="email" className="headers-text__svgMail"/>
                             <h3 className="headers-text__title">A verification link has been <br /> sent to your email account</h3>
                             <p className="headers-text__mail">Please click on the link that has just been sent to <br />your email account to verify your email and <br/>continue the registration process.</p>
                             <Link to="/login"><button> Log in</button></Link>
                             <a className="inputsForm__login inputsForm__login-a" onClick={() => alert('i do nothing yet :(')}>Didn't get an email?</a>
                         </div>
                     </div>
                 }
             </div>
          }
    </div>
    )
}

// export auth
export default AuthHandler;