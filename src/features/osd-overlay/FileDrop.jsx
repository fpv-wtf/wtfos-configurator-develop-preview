import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import {
  Typography,
  Stack,
  Paper,
} from "@mui/material";

import VideoIcon from "@mui/icons-material/Videocam";
import OsdIcon from "@mui/icons-material/Subtitles";
import FontIcon from "@mui/icons-material/EmojiSymbols";

import FileDropEntry from "./FileDropEntry";

export function useFileDropState() {
  const [files, setFiles] = React.useState({
    fontFileHd: null,
    fontFileSd: null,
    osdFile: null,
    srtFile: null,
    videoFile: null,
  });

  return [
    files,
    setFiles,
  ];
}

export default function FileDrop(props) {
  const {
    files,
    onChange,
  } = props;
  const { t } = useTranslation("osdOverlay");

  const inputRef = React.useRef(null);

  const setFilesFromFileList = React.useCallback((fileList) => {
    const changedFiles = { ...files };

    for (const file of fileList) {
      const name = file.name;
      const ext = name.split(".").pop().toLowerCase();

      switch (ext) {
        case "mp4":
          changedFiles.videoFile = file;
          break;

        case "osd":
          changedFiles.osdFile = file;
          break;

        case "srt":
          changedFiles.srtFile = file;
          break;

        case "png":
          if (name.includes("hd")) {
            changedFiles.fontFileHd = file;
          } else {
            changedFiles.fontFileSd = file;
          }
          break;

        default:
          break;
      }
    }

    onChange(changedFiles);
  }, [files, onChange]);

  const handleClick = React.useCallback((e) => {
    e.stopPropagation();

    if (inputRef.current) {
      inputRef.current.click();
    }
  }, [inputRef]);

  const handleDrop = React.useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    setFilesFromFileList(e.dataTransfer.files);
  }, [setFilesFromFileList]);

  const handleDrag = React.useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFileChange = React.useCallback((e) => {
    e.preventDefault();
    setFilesFromFileList(e.target.files);
  }, [setFilesFromFileList]);

  return (
    <Paper
      elevation={0}
      onClick={handleClick}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      sx={{
        "&:hover": {
          backgroundColor: "#28293E",
          cursor: "pointer",
        },
        p: 1,
      }}
    >
      <input
        accept=".mp4,.osd,.png"
        multiple
        onChange={handleFileChange}
        ref={inputRef}
        style={{ display: "none" }}
        type="file"
      />

      <Stack spacing={1}>
        <Typography variant="body1">
          {t("fileDropHelp")}
        </Typography>

        <FileDropEntry
          file={files.videoFile}
          icon={VideoIcon}
          label={t("fileDropVideo")}
        />

        <FileDropEntry
          file={files.osdFile}
          icon={OsdIcon}
          label={t("fileDropOsd")}
        />

        <FileDropEntry
          file={files.srtFile}
          icon={OsdIcon}
          label={t("fileDropSrt")}
        />

        <FileDropEntry
          file={files.fontFileSd}
          icon={FontIcon}
          label={t("fileDropFontSd")}
        />

        <FileDropEntry
          file={files.fontFileHd}
          icon={FontIcon}
          label={t("fileDropFontHd")}
        />
      </Stack>
    </Paper>
  );
}

FileDrop.propTypes = {
  files: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  onChange: PropTypes.func.isRequired,
};
