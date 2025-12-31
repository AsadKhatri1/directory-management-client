import React from 'react';
import './Card.css';

const Card = ({
    children,
    title,
    subtitle,
    footer,
    hoverable = false,
    className = '',
    onClick,
    ...props
}) => {
    const classes = [
        'ui-card',
        hoverable ? 'ui-card--hoverable' : '',
        onClick ? 'ui-card--clickable' : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={classes} onClick={onClick} {...props}>
            {(title || subtitle) && (
                <div className="ui-card__header">
                    {title && <h3 className="ui-card__title">{title}</h3>}
                    {subtitle && <p className="ui-card__subtitle">{subtitle}</p>}
                </div>
            )}
            <div className="ui-card__body">
                {children}
            </div>
            {footer && (
                <div className="ui-card__footer">
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;
