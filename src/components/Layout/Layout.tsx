import React from 'react';
import styled from 'styled-components';
import { AppTheme } from '../../theme/theme';
import { FrostedGlass } from '../FrostedGlass/FrostedGlass';

const BackgroundContainer = styled.div`
    min-height: 100vh;
    background: url('/img/bg.jpg') no-repeat center center fixed;
    background-size: cover;
    position: relative;
    color: ${AppTheme.colors.light.textPrimary};

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.7) 0%,
            rgba(0, 0, 0, 0.5) 100%
        );
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
    }
`;

const ContentContainer = styled.div`
    position: relative;
    max-width: 1400px;
    margin: 0 auto;
    padding: ${AppTheme.spacing[32]};
`;

const Header = styled(FrostedGlass)`
    margin-bottom: ${AppTheme.spacing[48]};
    padding: ${AppTheme.spacing[32]};
`;

const HeaderContent = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const HeaderText = styled.div`
    flex: 1;
`;

const Name = styled.h1`
    ${AppTheme.typography.heroDisplay};
    color: ${AppTheme.colors.light.textPrimary};
    margin: 0 0 ${AppTheme.spacing[8]};
`;

const Title = styled.h2`
    ${AppTheme.typography.title1};
    color: ${AppTheme.colors.light.textSecondary};
    margin: 0 0 ${AppTheme.spacing[24]};
`;

const Bio = styled.p`
    ${AppTheme.typography.body};
    color: ${AppTheme.colors.light.textPrimary};
    max-width: 800px;
    margin: 0;
`;

const SocialLinks = styled.div`
    display: flex;
    gap: ${AppTheme.spacing[16]};
    margin-top: ${AppTheme.spacing[24]};
`;

const SocialIcon = styled.a`
    color: ${AppTheme.colors.light.textPrimary};
    font-size: 24px;
    transition: transform 0.3s ease;
    &:hover {
        transform: translateY(-2px);
    }
`;

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <BackgroundContainer>
            <ContentContainer>
                <Header>
                    <HeaderContent>
                        <HeaderText>
                            <Name>D Everett Hinton</Name>
                            <Title>Senior Software Engineer & Pilot</Title>
                            <Bio>
                                I'm Everett, a results-driven professional and a software expert.
                                With over 10+ years of experience across app development, enterprise,
                                film & VFX, & games— I excel at turning cross-disciplinary, ambitious
                                ideas into reality and ensuring projects cross the finish line. Once
                                described as 'a one man wrecking crew' by an EP, when I'm not shipping
                                features, I'm in the hangar building planes or in the cockpit flying—bringing
                                the same discipline & passion to the skies as I do to my work.
                            </Bio>
                            <SocialLinks>
                                <SocialIcon href="https://www.instagram.com/" target="_blank">
                                    <i className="fab fa-instagram" />
                                </SocialIcon>
                                <SocialIcon href="https://www.youtube.com/@everettengineers/videos" target="_blank">
                                    <i className="fab fa-youtube" />
                                </SocialIcon>
                                <SocialIcon href="https://github.com/Kemerd" target="_blank">
                                    <i className="fab fa-github" />
                                </SocialIcon>
                                <SocialIcon href="https://www.linkedin.com/" target="_blank">
                                    <i className="fab fa-linkedin" />
                                </SocialIcon>
                            </SocialLinks>
                        </HeaderText>
                    </HeaderContent>
                </Header>
                {children}
            </ContentContainer>
        </BackgroundContainer>
    );
}; 