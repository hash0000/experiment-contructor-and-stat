// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { ApiProperty } from '@nestjs/swagger';
//
// @Schema({ toObject: { versionKey: false }, toJSON: { versionKey: false } })
// RequestedParametersRespondentDataTypeM {
//   @Prop({ required: true })
//   title: string;
//
//   @Prop({ required: true })
//   variableId: string;
//
//   @Prop({ required: true })
//   attributeId: string;
// }
//
// RequestedParametersRespondentDataTypeSchema = SchemaFactory.createForClass(RequestedParametersRespondentDataType);
//
// @Schema({ _id: false, toObject: { versionKey: false }, toJSON: { versionKey: false } })
// export class ExperimentSaveSettings {
//   @ApiProperty({ type: Boolean })
//   @Prop({ required: true, default: false })
//   timeOnEachSlide: boolean;
//
//   @ApiProperty({ type: Boolean })
//   @Prop({ required: true, default: false })
//   totalTime: boolean;
//
//   @ApiProperty({ type: Boolean })
//   @Prop({ required: true, default: false })
//   startTime: boolean;
//
//   @ApiProperty({ type: Boolean })
//   @Prop({ required: true, default: false })
//   endTime: boolean;
// }
//
// const ExperimentSaveSettingsSchema = SchemaFactory.createForClass(ExperimentSaveSettings);
//
// @Schema({ _id: false, toObject: { versionKey: false }, toJSON: { versionKey: false } })
// export class ExperimentSettingsBasicRespondentData {
//   @ApiProperty({ type: Boolean })
//   @Prop({ required: true, default: false })
//   firstName: boolean;
//
//   @ApiProperty({ type: Boolean })
//   @Prop({ required: true, default: false })
//   lastName: boolean;
//
//   @ApiProperty({ type: Boolean })
//   @Prop({ required: true, default: false })
//   birthday: boolean;
//
//   @ApiProperty({ type: Boolean })
//   @Prop({ required: true, default: false })
//   sex: boolean;
//
//   @ApiProperty({ type: Boolean })
//   @Prop({ required: true, default: false })
//   email: boolean;
//
//   @ApiProperty({ type: Boolean })
//   @Prop({ required: true, default: false })
//   phone: boolean;
//
//   @ApiProperty({ type: Boolean })
//   @Prop({ required: true, default: false })
//   nativeLanguages: boolean;
//
//   @ApiProperty({ type: Boolean })
//   @Prop({ required: true, default: false })
//   learnedLanguages: boolean;
// }
//
// const ExperimentSettingsBasicRespondentDataSchema = SchemaFactory.createForClass(ExperimentSettingsBasicRespondentData);
//
// @Schema({ toObject: { versionKey: false }, toJSON: { versionKey: false } })
// export class Experiment {
//   @Prop({ required: true, length: 256 })
//   title: string;
//
//   @Prop({ required: true, length: 1000 })
//   description: string;
//
//   @Prop({
//     required: true,
//     type: ExperimentSaveSettingsSchema,
//   })
//   saveSettings: ExperimentSaveSettings;
//
//   @Prop({
//     required: true,
//     type: ExperimentSettingsBasicRespondentDataSchema,
//   })
//   requestedBasicRespondentData: ExperimentSettingsBasicRespondentData;
//
//   @Prop({
//     required: true,
//     type: [RequestedParametersRespondentDataTypeSchema],
//     default: [],
//   })
//   requestedParametersRespondentData: RequestedParametersRespondentDataType[];
// }
//
// export const ExperimentSchema = SchemaFactory.createForClass(Experiment);
