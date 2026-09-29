import React from 'react';
import { render, screen } from '@testing-library/react';
import { ConstellationBackdrop } from '../constellation-backdrop';
import { Constellation3D } from '../constellation-3d';
import * as webglUtils from '@/utils/webgl';

jest.mock('@react-three/fiber', () => ({
  Canvas: () => <div data-testid="r3f-canvas">Canvas</div>,
}));

describe('Scene WebGL Fallbacks', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders nothing for ConstellationBackdrop when WebGL is unsupported', () => {
    jest.spyOn(webglUtils, 'hasWebGL').mockReturnValue(false);
    const { container } = render(<ConstellationBackdrop />);
    expect(container.firstChild).toBeNull();
  });

  it('renders 2D fallback for Constellation3D when WebGL is unsupported', () => {
    jest.spyOn(webglUtils, 'hasWebGL').mockReturnValue(false);
    render(<Constellation3D vouchers={[{ id: '1', name: 'Test Voucher' }]} />);
    
    expect(screen.getByText('Dashboard Hero')).toBeInTheDocument();
    expect(screen.getByText('Test Voucher')).toBeInTheDocument();
    expect(screen.queryByTestId('r3f-canvas')).not.toBeInTheDocument();
  });
});
