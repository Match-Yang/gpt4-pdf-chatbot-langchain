
// 定义一个枚举值 DiscordSlashCommandName
const DiscordSlashCommandName = {
    kHelp: 'help',
    kStopAsking: 'stop_asking',
    kFlutterCallKit: 'flutter_call_kit',
    kFlutterCallKitInvitation: 'flutter_call_kit_invitation',
    kFlutterLiveAudioRoomKit: 'flutter_live_audio_room_kit',
    kFlutterLiveStreamingKit: 'flutter_live_streaming_kit',
    kFlutterVideoConferenceKit: 'flutter_video_conference_kit',

    kWebUIKit: 'web_uikit',
    kFlutterExpress: 'flutter_express',
    kRNExpress: 'rn_express',
    kAndroidExpress: 'android_express',
    kiOSExpress: 'ios_express',
    kWebExpress: 'web_express',
}
const PineconeIndexNameUIKit = 'zegouikit';
const PineconeIndexNameExpress = 'express';

const DiscordSlashCommandPineconeInfo = {}
DiscordSlashCommandPineconeInfo[DiscordSlashCommandName.kFlutterCallKit] = {pinecone_index_name: PineconeIndexNameUIKit, pinecone_name_space: 'flutter_call_kit'};
DiscordSlashCommandPineconeInfo[DiscordSlashCommandName.kFlutterCallKitInvitation] = {pinecone_index_name: PineconeIndexNameUIKit, pinecone_name_space: 'flutter_call_kit_invitation'};
DiscordSlashCommandPineconeInfo[DiscordSlashCommandName.kFlutterLiveAudioRoomKit] = {pinecone_index_name: PineconeIndexNameUIKit, pinecone_name_space: 'flutter_uikit_live_audio_room'};
DiscordSlashCommandPineconeInfo[DiscordSlashCommandName.kFlutterLiveStreamingKit] = {pinecone_index_name: PineconeIndexNameUIKit, pinecone_name_space: 'flutter_live_streaming_kit'};
DiscordSlashCommandPineconeInfo[DiscordSlashCommandName.kFlutterVideoConferenceKit] = {pinecone_index_name: PineconeIndexNameUIKit, pinecone_name_space: 'flutter_video_conference_kit'};


DiscordSlashCommandPineconeInfo[DiscordSlashCommandName.kWebUIKit] = {pinecone_index_name: PineconeIndexNameUIKit, pinecone_name_space: 'web_uikit'};
DiscordSlashCommandPineconeInfo[DiscordSlashCommandName.kWebExpress] = {pinecone_index_name: PineconeIndexNameExpress, pinecone_name_space: 'web_express'};
DiscordSlashCommandPineconeInfo[DiscordSlashCommandName.kAndroidExpress] = {pinecone_index_name: PineconeIndexNameExpress, pinecone_name_space: 'android_express'};
DiscordSlashCommandPineconeInfo[DiscordSlashCommandName.kiOSExpress] = {pinecone_index_name: PineconeIndexNameExpress, pinecone_name_space: 'ios_express'};
DiscordSlashCommandPineconeInfo[DiscordSlashCommandName.kFlutterExpress] = {pinecone_index_name: PineconeIndexNameExpress, pinecone_name_space: 'flutter_express'};
DiscordSlashCommandPineconeInfo[DiscordSlashCommandName.kRNExpress] = {pinecone_index_name: PineconeIndexNameExpress, pinecone_name_space: 'rn_express'};

module.exports =   {
    DiscordSlashCommandName, 
    DiscordSlashCommandPineconeInfo
}