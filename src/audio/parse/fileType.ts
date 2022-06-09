export type FileType =
  | "mpeg"
  | "flac"
  | "apev2"
  | "mp4"
  | "ogg"
  | "adts"
  | "asf"
  | "aiff"
  | "riff"
  | "wavpack"
  | "musepack"
  | "matroska"
  | "dsf";

export const parseFileType = (view: DataView): FileType | undefined => {
  if (check(view, 0x49_44_33_00 /* "ID3" */, 0, 0xff_ff_ff_00)) {
    return "mpeg";
  } else if (
    check(view, 0x4d_50_2b_00 /* "MP+" */, 0, 0xff_ff_ff_00) ||
    check(view, 0x4d_50_43_4b /* "MPCK" */)
  ) {
    return "musepack";
  } else if (check(view, 0x46_4f_52_4d /* "FORM" */)) {
    return "aiff";
  } else if (check(view, 0x4f_67_67_53 /* "OggS" */)) {
    return "ogg";
  } else if (check(view, 0x66_74_79_70 /* "ftyp" */, 4)) {
    return "mp4";
  } else if (check(view, 0x44_53_44_20 /* "DSD " */)) {
    return "dsf";
  } else if (check(view, 0x66_4c_61_43 /* "fLaC" */)) {
    return "flac";
  } else if (check(view, 0x77_76_70_6b /* "wvpk" */)) {
    return "wavpack";
  } else if (check(view, 0x4d_41_43_20 /* "MAC " */)) {
    return "apev2";
  } else if (check(view, 0x1a_45_df_a3)) {
    return "matroska";
  } else if (
    check(view, 0x52_49_46_46 /* "RIFF" */) &&
    check(view, 0x57_41_56_45 /* "WAVE" */, 8)
  ) {
    return "riff"; // audio/vnd.wave
  } else if (
    check(view, 0x30_26_b2_75) &&
    check(view, 0x8e_66_cf_11, 4) &&
    check(view, 0xa6_d9_00_00, 8, 0xff_ff_00_00)
  ) {
    return "asf";
  } else if (check(view, 0xff_f0_00_00, 0, 0xff_f6_00_00)) {
    return "adts";
  } else if (check(view, 0xff_e0_00_00, 0, 0xff_e0_00_00)) {
    return "mpeg";
  }

  return;
};

const check = (view: DataView, header: number, offset = 0, mask?: number) => {
  return header === (view.getUint32(offset) & (mask ?? 0xffffffff));
};
