import PropTypes from "prop-types";
import React, {
  useCallback,
  useEffect,
} from "react";
import {
  useDispatch,
  useSelector,
} from "react-redux";
import { useTranslation } from "react-i18next";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import ReactGA from "react-ga4";

import Log from "../log/Log";

import {
  appendToLog,
  checkBinaries,
  clearLog,
  rebooting,
  selectHasOpkgBinary,
  selectNiceName,
} from "../device/deviceSlice";

import {
  removeWTFOS,
  selectProcessing,
} from "../packages/packagesSlice";

export default function Remove({ adb }) {
  const { t } = useTranslation("setup");
  const dispatch = useDispatch();

  const hasOpkgBinary = useSelector(selectHasOpkgBinary);
  const isProcessing = useSelector(selectProcessing);
  const deviceName = useSelector(selectNiceName);

  const onClick = useCallback(async (device) => {
    ReactGA.gtag("event", "removeWtfosTriggered", { deviceName });

    dispatch(clearLog());
    dispatch(removeWTFOS({
      adb,
      callback: (message) => {
        dispatch(appendToLog(message));
      },
      setRebooting: () => {
        ReactGA.gtag("event", "removeWtfosDone", { deviceName });

        dispatch(rebooting(true));
      },
    }));

    dispatch(checkBinaries(adb));
  }, [adb, deviceName, dispatch]);

  // Clean up when switching context (onUnmount)
  useEffect(() => {
    return async() => {
      dispatch(clearLog());
    };
  }, [dispatch]);

  return(
    <Stack spacing={2}>
      <Button
        disabled={!hasOpkgBinary || isProcessing}
        onClick={onClick}
        variant="contained"
      >
        {t("remove")}
      </Button>

      <Log />
    </Stack>
  );
}

Remove.propTypes = { adb: PropTypes.shape().isRequired };
