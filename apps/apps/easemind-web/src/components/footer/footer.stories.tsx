import { Meta, StoryObj } from '@storybook/react';
import * as DocBlock from '@storybook/blocks';
import { EaseMindFooter } from './footer';

const meta = {
    title: 'Components/Footer',
    component: EaseMindFooter,
    tags: ['autodocs'],
    parameters: {
        docs: {
            page: () =>
                <>
                    <DocBlock.Title />
                    <DocBlock.Description />

                    <DocBlock.Primary />
                    <DocBlock.Controls />
                </>
        }
    }
} satisfies Meta<typeof EaseMindFooter>;

export default meta;

type Story = StoryObj<typeof EaseMindFooter>;


export const Desktop: Story = {
    parameters: {
        layout: 'fullscreen',
        viewport: {
            defaultViewport: 'desktop',
        }
    }
};

export const Mobile: Story = {
    parameters: {
        layout: 'fullscreen',
        viewport: {
            defaultViewport: 'mobile',
        }
    }
}
