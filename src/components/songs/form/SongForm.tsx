import { Song } from "app/services/songs";
import ChordSelect from "components/songs/ChordSelect";
import { YoutubeView } from "components/songs/YoutubeView";
import React from "react";
import {
  useForm,
  SubmitHandler,
  SubmitErrorHandler,
  useFieldArray,
  Controller,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button, Input } from "react-daisyui";
import FormControl from "ui/form/FormControl";
import FormSection from "ui/form/FormSection";
import ChordChartTextInput from "components/songs/ChordChartTextInput";
import { SongSectionFieldPanel } from "./SongSectionFieldPanel";

type SongFormProps = {
  onSubmit: SubmitHandler<Song>;
  onError: SubmitErrorHandler<Song>;
  isLoading?: boolean;
  data: Song;
};

export function SongForm({ onSubmit, onError, data }: SongFormProps) {
  const { register, handleSubmit, watch, control } = useForm<Song>({ defaultValues: data });
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "sections",
  });

  const currentYoutubeValue = watch("youtube", data.youtube);
  const { t } = useTranslation();

  function handleAddTextChordChartSection() {
    append({ title: "Untitled Section " + (fields.length + 1), body: "", type: "text" });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <YoutubeView className="youtube-view-input" value={currentYoutubeValue} />
      <FormSection>
        <FormControl label={t("song:label/title")}>
          <Input {...register("title")} />
        </FormControl>
        <FormControl label={t("song:label/artist")}>
          <Input {...register("artist")} />
        </FormControl>
        <FormControl label={t("song:label/key")}>
          <ChordSelect {...register("key")} />
        </FormControl>
        <FormControl label={t("song:label/youtube")}>
          <Input {...register("youtube")} />
        </FormControl>
      </FormSection>

      <FormSection>
        <Button onClick={handleAddTextChordChartSection}>
          {t("song:label/section/add_text_chord_chart_section")}
        </Button>
      </FormSection>

      {fields.map((field, index) => (
        <FormSection key={field.id}>
          <FormControl label={t("song:label/section/title")}>
            <Input {...register(`sections.${index}.title`)} />
          </FormControl>

          <div className="mt-4 mb-4">
            <SongSectionFieldPanel
              onMoveUp={() => move(index, index - 1)}
              onMoveDown={() => move(index, index + 1)}
              isUpDisabled={index === 0}
              isDownDisabled={index === fields.length - 1}
              onDelete={() => remove(index)}
            />
          </div>

          <FormControl label={t("song:label/section/body")}>
            <Controller
              control={control}
              name={`sections.${index}.body`}
              render={({ field: { onChange, value } }) => (
                <ChordChartTextInput value={value || ""} onValueChange={onChange} />
              )}
            />
          </FormControl>
        </FormSection>
      ))}

      <FormSection>
        <Button type="submit">{t("save")}</Button>
      </FormSection>
    </form>
  );
}