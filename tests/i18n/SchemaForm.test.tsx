import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { SchemaForm } from '../../src/schema/SchemaForm/index';
import { I18nContext } from '../../src/i18n';
import { cnLabels, enLabels } from '../../src/i18n';

describe('SchemaForm i18n tests', () => {
    const mockSchema:any = {
        version: '1.0.0',
        name: 'test-form',
        description: 'Test form schema',
        author: 'test',
        type: 'object',
        component: {
            properties: {
                name: {
                    type: 'string',
                    title: 'Name'
                },
                age: {
                    type: 'number',
                    title: 'Age'
                }
            },
        },
        required: ['name', 'age'],
        uiSchema: {}
    };

    it('should render form labels in Chinese', () => {
        render(
            <I18nContext.Provider value={{ locale: cnLabels }}>
                <SchemaForm schema={mockSchema} />
            </I18nContext.Provider>
        );

        // Test form labels and buttons in Chinese
        expect(screen.getByPlaceholderText('请输入 Age')).toBeDefined();
    });

    it('should render form labels in English', () => {
        render(
            <I18nContext.Provider value={{ locale: enLabels }}>
                <SchemaForm schema={mockSchema} />
            </I18nContext.Provider>
        );

        // Test form labels and buttons in English
        expect(screen.getByPlaceholderText('Please input Age')).toBeDefined();
    });
}); 