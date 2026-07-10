import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useBookDetails } from '@/hooks/use-book-details';

// Deterministic generator for mock book page text based on book details
const getMockPages = (title: string, author: string, subjects: string[]) => {
  const genre = subjects.length > 0 ? subjects[0] : 'Fiction';
  
  return [
    {
      chapter: 'Chapter I: The Threshold',
      content: `The air in the library was thick with the scent of old paper and leather bindings. ${title} sat on the mahogany desk, its cover reflecting the dim golden glow of the desk lamp. Written by the illustrious ${author}, it was a volume that promised more than just ink on paper; it promised a journey.\n\nOutside, rain patted against the glass panes like soft fingers searching for entry. Within these walls, however, the silence was absolute, save for the turn of a page. You adjust your reading glasses, trace the first letters of the dedication, and begin.`,
    },
    {
      chapter: 'Chapter II: Echoes of the Past',
      content: `The text unfolds with a vivid exploration of its core themes in ${genre}. Every paragraph reveals a masterclass in narration. "To understand the present," the passage read, "one must first venture into the quiet corridors of what has already passed."\n\nThere was something almost hypnotic about ${author}'s prose. The words moved like water—sometimes a calm stream, sometimes a sudden surge of rapids that caught you off guard. You find yourself highlighting lines, nodding in agreement, and feeling the weight of the ideas.`,
    },
    {
      chapter: 'Chapter III: The Nexus',
      content: `As the plot advances, we find ourselves at a critical junction. The arguments presented in ${title} began to weave together, forming a tapestry of complex relationships and profound realizations.\n\n"True discovery," wrote the author, "does not lie in finding new landscapes, but in looking with new eyes." You stop to contemplate this thought, staring blankly at the warm wood grain of the desk. The depth of ${genre} literature is laid bare on these pages.`,
    },
    {
      chapter: 'Chapter IV: Epilogue',
      content: `We reach the end of this digital preview. The final page concludes with a lingering thought that stays with the reader long after the book is closed. ${author} leaves us with a parting query, a final riddle to unravel in our own time.\n\nThank you for purchasing and supporting this independent bookstore. Your secure purchase of "${title}" has granted you full digital access to this copy. May it inspire many more late-night readings.`,
    },
  ];
};

export default function ReaderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { book, loading, error } = useBookDetails(id || '');
  const [currentPage, setCurrentPage] = useState(0);

  const handleClose = () => {
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }} className="bg-[#FDFBF7] justify-center items-center">
        <ActivityIndicator size="large" color="#0F172A" />
        <Text className="text-brand-text-muted text-xs mt-4 font-serif italic">Opening book...</Text>
      </SafeAreaView>
    );
  }

  if (error || !book) {
    return (
      <SafeAreaView style={{ flex: 1 }} className="bg-[#FDFBF7] justify-center items-center p-6">
        <Text className="text-brand-text font-bold text-lg mb-2 font-serif">Unable to Open Book</Text>
        <Text className="text-brand-text-muted text-xs text-center mb-6">
          We couldn't retrieve the contents of this book at this time.
        </Text>
        <Pressable
          onPress={handleClose}
          className="bg-primary px-6 py-3 rounded-xl shadow-sm"
        >
          <Text className="text-white font-bold text-xs">Close Reader</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const pages = getMockPages(book.title, book.authors.join(', '), book.subjects);
  const totalPages = pages.length;
  const pageData = pages[currentPage];

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-[#FDFBF7]">
      {/* Reader Header */}
      <View className="px-4 py-3 flex-row items-center justify-between border-b border-brand-text-muted/10">
        <Pressable
          onPress={handleClose}
          className="w-8 h-8 rounded-full items-center justify-center bg-brand-text/5 active:bg-brand-text/10"
        >
          <Text className="text-primary text-base font-bold">×</Text>
        </Pressable>
        <View className="flex-1 items-center px-4">
          <Text className="text-brand-text font-bold text-xs font-serif text-center" numberOfLines={1}>
            {book.title}
          </Text>
          <Text className="text-brand-text-muted text-[9px] text-center" numberOfLines={1}>
            by {book.authors.join(', ')}
          </Text>
        </View>
        <Text className="text-brand-text-muted text-[10px] font-semibold">
          Page {currentPage + 1} of {totalPages}
        </Text>
      </View>

      {/* Reader Body (warm paper layout) */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 24, paddingHorizontal: 20 }}
        className="flex-1"
      >
        <View className="gap-5">
          <Text className="text-brand-text font-bold text-lg font-serif italic text-center mb-2">
            {pageData.chapter}
          </Text>
          <Text style={{ fontFamily: 'serif' }} className="text-brand-text text-sm leading-6 text-justify">
            {pageData.content}
          </Text>
        </View>
      </ScrollView>

      {/* Reader Footer Controls */}
      <View className="flex-row items-center justify-between px-6 py-4 border-t border-brand-text-muted/10 bg-[#FDFBF7]">
        <Pressable
          onPress={handlePrevPage}
          disabled={currentPage === 0}
          className={`px-4 py-2.5 rounded-xl ${currentPage === 0 ? 'opacity-30' : 'active:bg-brand-text/5'}`}
        >
          <Text className="text-brand-text font-bold text-xs font-serif">← Previous</Text>
        </Pressable>

        {/* Progress Bar */}
        <View className="flex-1 h-[3px] bg-brand-text-muted/10 mx-6 rounded-full overflow-hidden">
          <View
            style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
            className="h-full bg-primary"
          />
        </View>

        <Pressable
          onPress={handleNextPage}
          disabled={currentPage === totalPages - 1}
          className={`px-4 py-2.5 rounded-xl ${currentPage === totalPages - 1 ? 'opacity-30' : 'active:bg-brand-text/5'}`}
        >
          <Text className="text-brand-text font-bold text-xs font-serif">Next →</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
