// idl.d.ts
declare module '@/idl/pdc_blockchain_part.json' {
  import { Idl } from '@coral-xyz/anchor';
  const idl: Idl & {
    metadata: {
      address: string;
      name: string;
      version: string;
    };
  };
  export default idl;
}