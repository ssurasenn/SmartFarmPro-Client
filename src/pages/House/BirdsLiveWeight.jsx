import React from 'react'
import { useTranslation } from "react-i18next";


const BirdsLiveWeight = () => {
  const { t } = useTranslation();
  return (
    <div>BirdsLiveWeight
      <div>{t("welcome")}</div>
    </div>
  )
}

export default BirdsLiveWeight