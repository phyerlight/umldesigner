import { TestBed, inject } from '@angular/core/testing';

import { FileType, registerFileType } from './FileType';

describe('FileType', () => {
    it('registers new types', () => {
        expect(Object.keys(FileType)).toEqual([]);
        registerFileType('dummyType');
        expect(FileType['dummyType']).toEqual({});
    });
});
