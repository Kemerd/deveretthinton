import styled from 'styled-components';
import { AppTheme } from '../theme/theme';

export const QuipText = styled.p`
    ${AppTheme.styledComponents.QuipText}
    
    @media (max-width: 1268px) {
        /* Allow text to wrap naturally on smaller screens */
        white-space: normal;
        text-align: center;
        padding: 0 ${AppTheme.spacing[24]};
        margin-bottom: ${AppTheme.spacing[16]};
    }
`; 