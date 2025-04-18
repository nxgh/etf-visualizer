declare global {
  interface FundList {
    code: string;
    pk_id: string;
    name: string;
    type: string;
    desc: string;
    line: string;
    created_at: Date;
    updated_at: Date;
  }  
}

export default global;
