import React from 'react';
import { BehaviourProvidorDiv } from '@/components/ui/behaviour-providor-div';
import { Button } from '@/components/ui/button';
import '../styles/add-purchase-row.css';

const AddMedicineRow = () => {
  return (
    <div className="flex items-center  w-full">
      <div className="h-16 initial" />
      <div className="h-16"></div>
      <BehaviourProvidorDiv className="productName">hello</BehaviourProvidorDiv>
      <BehaviourProvidorDiv className="hsn">hello</BehaviourProvidorDiv>
      <BehaviourProvidorDiv className="batch">hello</BehaviourProvidorDiv>
      <BehaviourProvidorDiv className="expiry">hello</BehaviourProvidorDiv>
      <BehaviourProvidorDiv className="pack">hello</BehaviourProvidorDiv>
      <BehaviourProvidorDiv className="qty">hello</BehaviourProvidorDiv>
      <BehaviourProvidorDiv className="free">hello</BehaviourProvidorDiv>
      <BehaviourProvidorDiv className="mrp">hello</BehaviourProvidorDiv>
      <BehaviourProvidorDiv className="rate">hello</BehaviourProvidorDiv>
      <BehaviourProvidorDiv className="sch">hello</BehaviourProvidorDiv>
      <BehaviourProvidorDiv className="disc">hello</BehaviourProvidorDiv>
      <BehaviourProvidorDiv className="gst">hello</BehaviourProvidorDiv>
      <BehaviourProvidorDiv className="margin">hello</BehaviourProvidorDiv>
      <BehaviourProvidorDiv className="amount">hello</BehaviourProvidorDiv>
      <div className="amount">
        <Button variant="secondary" className="font-bold mx-4">
          ADD
        </Button>
        <Button variant="secondary" className="font-bold mx-4">
          ADD
        </Button>
      </div>
    </div>
  );
};

export default AddMedicineRow;
