import { FrostedGlass } from './FrostedGlass/FrostedGlass';
import { AppTheme } from '../theme/theme';

export const Example = () => {
    return (
        <FrostedGlass
            width={300}
            height={200}
            borderRadius={AppTheme.radius.large}
            glowIntensity={0.15}
        >
            <h1 style={AppTheme.typography.title1}>Hello World</h1>
        </FrostedGlass>
    );
}; 