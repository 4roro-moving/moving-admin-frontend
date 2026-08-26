"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils/cn";

interface AdminTermsContentProps {
  /** 약관 본문 (Markdown) */
  content: string;
  className?: string;
}

/**
 * 관리자 작성 화면의 본문 미리보기.
 *
 * 사용자 화면(`front/src/components/terms/TermsContent.tsx`)과 같은 결과를 내야 합니다.
 * 그쪽 컴포넌트에도 "관리자 쪽을 함께 확인하라"는 주석이 달려 있으니,
 * 어느 한쪽 스타일을 바꿀 때는 반드시 둘을 같이 보세요.
 *
 * 차이는 색 토큰뿐입니다. 사용자 화면은 `text-text-secondary` 계열을 쓰고
 * 관리자는 `text-muted` / `text-foreground` 계열을 씁니다. 여백과 위계는 동일합니다.
 *
 * `react-markdown` 은 raw HTML 을 렌더링하지 않아 XSS 에 안전합니다.
 * `rehype-raw` 등을 붙이면 이 전제가 깨지므로 도입 전 검토가 필요합니다.
 */
export default function AdminTermsContent({ content, className }: AdminTermsContentProps) {
  return (
    <div
      className={cn(
        "text-sm leading-6 text-muted",
        // 조 제목
        "[&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:leading-7 [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:first:mt-0",
        "[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:leading-7 [&_h3]:font-semibold [&_h3]:text-foreground",
        // 문단
        "[&_p]:mb-3 [&_p]:last:mb-0",
        // 항 목록
        "[&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5",
        "[&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5",
        "[&_li]:mb-1",
        // 강조와 링크
        "[&_strong]:font-semibold [&_strong]:text-foreground",
        "[&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2",
        // 구분선과 인용
        "[&_hr]:my-6 [&_hr]:border-border",
        "[&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:text-muted",
        // 표
        "[&_table]:mb-3 [&_table]:w-full [&_table]:border-collapse",
        "[&_th]:border [&_th]:border-border [&_th]:bg-background [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:text-foreground",
        "[&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2",
        className,
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
