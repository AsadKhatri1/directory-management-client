import React from 'react';
import './Input.css';

const Input = ({
    label,
    error,
    helperText,
    required = false,
    fullWidth = false,
    className = '',
    type = 'text',
    ...props
}) => {
    const inputClasses = [
        'ui-input',
        error ? 'ui-input--error' : '',
        fullWidth ? 'ui-input--full-width' : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={`ui-input-wrapper ${fullWidth ? 'ui-input-wrapper--full-width' : ''}`}>
            {label && (
                <label className="ui-input-label">
                    {label}
                    {required && <span className="ui-input-required">*</span>}
                </label>
            )}
            <input
                type={type}
                className={inputClasses}
                {...props}
            />
            {error && <p className="ui-input-error-text">{error}</p>}
            {helperText && !error && <p className="ui-input-helper-text">{helperText}</p>}
        </div>
    );
};

export default Input;
